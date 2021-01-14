import * as os from 'os';
import * as path from 'path';
import { v4 } from 'uuid';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { OK, BAD_REQUEST, METHOD_NOT_ALLOWED, NOT_FOUND, INTERNAL_SERVER_ERROR, REQUESTED_RANGE_NOT_SATISFIABLE, PARTIAL_CONTENT } from 'http-status-codes';
import URI from '@theia/core/lib/common/uri';
import { isEmpty } from '@theia/core/lib/common/objects';
import { ILogger } from '@theia/core/lib/common/logger';
import { FileUri } from '@theia/core/lib/node/file-uri';
import { DirectoryArchiver } from '@theia/filesystem/lib/node/download/directory-archiver';
import { FileDownloadData } from '@theia/filesystem/lib/common/download/file-download-data';
import { Component, Autowired, TenantProvider } from '@malagu/core';
import { FileRepository, FileStat } from '@cellbang/filesystem-entity/lib/node';
import { FileSystemProvider } from '@theia/filesystem/lib/common/files';
import { Readable } from 'stream';
import { FileDownloadCache } from './file-download-cache';
import { DownloadStorageItem } from '@cellbang/filesystem-entity/lib/node';

interface PrepareDownloadOptions {
    filePath: string;
    downloadId: string;
    remove: boolean;
    root?: string;
}

@injectable()
export abstract class FileDownloadHandler {

    @inject(ILogger)
    protected readonly logger: ILogger;

    @inject(DirectoryArchiver)
    protected readonly directoryArchiver: DirectoryArchiver;

    @inject(FileDownloadCache)
    protected readonly fileDownloadCache: FileDownloadCache;

    @Autowired(FileRepository)
    protected readonly fileRepository: FileRepository;

    @Autowired(FileSystemProvider)
    protected readonly fileSystemProvider: FileSystemProvider;

    @Autowired(TenantProvider)
    protected tenantProvider: TenantProvider;

    public abstract handle(request: Request, response: Response): Promise<void>;

    protected getTenant() {
        return this.tenantProvider.provide();
        ;
    }

    /**
     * Prepares the file and the link for download
     */
    protected async prepareDownload(request: Request, response: Response, options: PrepareDownloadOptions): Promise<void> {
        const name = path.basename(options.filePath);
        try {
            const size = await this.fileRepository.getFileSize(options.filePath, await this.getTenant());
            const item = new DownloadStorageItem();
            item.downloadId = options.downloadId;
            item.file = options.filePath;
            item.remove = options.remove;
            item.root = options.root;
            item.size = size;
            await this.fileDownloadCache.addDownload(item);
            // do not send filePath but instead use the downloadId
            const data = { name, id: options.downloadId };
            response.status(OK).send(data).end();
        } catch (e) {
            this.handleError(response, e, INTERNAL_SERVER_ERROR);
        }
    }

    protected async download(request: Request, response: Response, downloadInfo: DownloadStorageItem, id: string): Promise<void> {
        const filePath = downloadInfo.file;
        const statSize = downloadInfo.size;
        // this sets the content-disposition and content-type automatically
        response.attachment(filePath);
        try {
            await this.fileRepository.getFileSize(filePath, downloadInfo.tenant);

            response.setHeader('Accept-Ranges', 'bytes');
            // parse range header and combine multiple ranges
            const range = this.parseRangeHeader(request.headers['range'], statSize);
            if (!range) {
                response.setHeader('Content-Length', statSize);
                this.streamDownload(OK, response, await this.fileRepository.readFileStream(filePath, downloadInfo.tenant), id);
            } else {
                const rangeStart = range.start;
                const rangeEnd = range.end;
                if (rangeStart >= statSize || rangeEnd >= statSize) {
                    response.setHeader('Content-Range', `bytes */${statSize}`);
                    // Return the 416 'Requested Range Not Satisfiable'.
                    response.status(REQUESTED_RANGE_NOT_SATISFIABLE).end();
                    return;
                }
                response.setHeader('Content-Range', `bytes ${rangeStart}-${rangeEnd}/${statSize}`);
                response.setHeader('Content-Length', rangeStart === rangeEnd ? 0 : (rangeEnd - rangeStart + 1));
                response.setHeader('Cache-Control', 'no-cache');
                this.streamDownload(PARTIAL_CONTENT, response, await this.fileRepository.readFileStream(filePath, downloadInfo.tenant, { start: rangeStart, end: rangeEnd }), id);
            }
        } catch (e) {
            await this.fileDownloadCache.deleteDownload(id);
            this.handleError(response, e, INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Streams the file and pipe it to the Response to avoid any OOM issues
     */
    protected streamDownload(status: number, response: Response, stream: Readable, id: string): void {
        response.status(status);
        stream.on('error', error => {
            this.fileDownloadCache.deleteDownload(id).then(() => this.handleError(response, error, INTERNAL_SERVER_ERROR));
        });
        response.on('error', error => {
            this.fileDownloadCache.deleteDownload(id).then(() => this.handleError(response, error, INTERNAL_SERVER_ERROR));
        });
        response.on('close', () => {
            stream.destroy();
        });
        stream.pipe(response);
    }
    protected parseRangeHeader(range: string | string[] | undefined, statSize: number): { start: number, end: number } | undefined {
        if (!range || range.length === 0 || Array.isArray(range)) {
            return;
        }
        const index = range.indexOf('=');
        if (index === -1) {
            return;
        }
        const rangeType = range.slice(0, index);
        if (rangeType !== 'bytes') {
            return;
        }
        const [start, end] = range.slice(index + 1).split('-').map(r => parseInt(r, 10));
        return {
            start: isNaN(start) ? 0 : start,
            end: (isNaN(end) || end > statSize - 1) ? (statSize - 1) : end
        };
    }
    protected async archive(inputPath: string, outputPath: string = path.join(os.tmpdir(), v4()), entries?: string[]): Promise<string> {
        await this.directoryArchiver.archive(inputPath, outputPath, entries);
        return outputPath;
    }

    protected async createTempDir(downloadId: string = v4()): Promise<string> {
        const outputPath = path.join(os.tmpdir(), downloadId);
        return outputPath;
    }

    protected async handleError(response: Response, reason: string | Error, status: number = INTERNAL_SERVER_ERROR): Promise<void> {
        this.logger.error(reason);
        response.status(status).send('Unable to download file.').end();
    }

}

export namespace FileDownloadHandler {
    export const SINGLE: symbol = Symbol('single');
    export const MULTI: symbol = Symbol('multi');
    export const DOWNLOAD_LINK: symbol = Symbol('download');
}

@Component(DownloadLinkHandler)
export class DownloadLinkHandler extends FileDownloadHandler {

    async handle(request: Request, response: Response): Promise<void> {
        const { method, query } = request;
        if (method !== 'GET' && method !== 'HEAD') {
            this.handleError(response, `Unexpected HTTP method. Expected GET got '${method}' instead.`, METHOD_NOT_ALLOWED);
            return;
        }
        if (query === undefined || query.id === undefined || typeof query.id !== 'string') {
            this.handleError(response, `Cannot access the 'id' query from the request. The query was: ${JSON.stringify(query)}.`, BAD_REQUEST);
            return;
        }
        const cancelDownload = query.cancel;
        const downloadInfo = await this.fileDownloadCache.getDownload(query.id);
        if (!downloadInfo) {
            this.handleError(response, `Cannot find the file from the request. The query was: ${JSON.stringify(query)}.`, NOT_FOUND);
            return;
        }
        // allow head request to determine the content length for parallel downloaders
        if (method === 'HEAD') {
            response.setHeader('Content-Length', downloadInfo.size);
            response.status(OK).end();
            return;
        }
        if (!cancelDownload) {
            this.download(request, response, downloadInfo, query.id);
        } else {
            this.logger.info('Download', query.id, 'has been cancelled');
            await this.fileDownloadCache.deleteDownload(query.id);
        }
    }
}

@Component(SingleFileDownloadHandler)
export class SingleFileDownloadHandler extends FileDownloadHandler {

    async handle(request: Request, response: Response): Promise<void> {
        const { method, body, query } = request;
        if (method !== 'GET') {
            this.handleError(response, `Unexpected HTTP method. Expected GET got '${method}' instead.`, METHOD_NOT_ALLOWED);
            return;
        }
        if (body !== undefined && !isEmpty(body)) {
            this.handleError(response, `The request body must either undefined or empty when downloading a single file. The body was: ${JSON.stringify(body)}.`, BAD_REQUEST);
            return;
        }
        if (query === undefined || query.uri === undefined || typeof query.uri !== 'string') {
            this.handleError(response, `Cannot access the 'uri' query from the request. The query was: ${JSON.stringify(query)}.`, BAD_REQUEST);
            return;
        }
        const uri = new URI(query.uri).toString(true);
        const filePath = FileUri.fsPath(uri);

        let stat: FileStat;
        try {
            stat = await this.fileRepository.stat(filePath, await this.getTenant());
        } catch {
            this.handleError(response, `The file does not exist. URI: ${uri}.`, NOT_FOUND);
            return;
        }
        try {
            const downloadId = v4();
            const options: PrepareDownloadOptions = { filePath, downloadId, remove: false };
            if (!stat.isDirectory) {
                await this.prepareDownload(request, response, options);
            } else {
                const outputRootPath = await this.createTempDir(downloadId);
                const outputPath = path.join(outputRootPath, `${path.basename(filePath) || 'root'}.tar`);
                await this.archive(filePath, outputPath);
                options.filePath = outputPath;
                options.remove = true;
                options.root = outputRootPath;
                await this.prepareDownload(request, response, options);
            }
        } catch (e) {
            this.handleError(response, e, INTERNAL_SERVER_ERROR);
        }
    }

}

@Component(MultiFileDownloadHandler)
export class MultiFileDownloadHandler extends FileDownloadHandler {

    async handle(request: Request, response: Response): Promise<void> {
        const { method, body } = request;
        if (method !== 'PUT') {
            this.handleError(response, `Unexpected HTTP method. Expected PUT got '${method}' instead.`, METHOD_NOT_ALLOWED);
            return;
        }
        if (body === undefined) {
            this.handleError(response, 'The request body must be defined when downloading multiple files.', BAD_REQUEST);
            return;
        }
        if (!FileDownloadData.is(body)) {
            this.handleError(response, `Unexpected body format. Cannot extract the URIs from the request body. Body was: ${JSON.stringify(body)}.`, BAD_REQUEST);
            return;
        }
        if (body.uris.length === 0) {
            this.handleError(response, `Insufficient body format. No URIs were defined by the request body. Body was: ${JSON.stringify(body)}.`, BAD_REQUEST);
            return;
        }
        for (const uri of body.uris) {
            try {
                await this.fileRepository.stat(FileUri.fsPath(uri), await this.getTenant());
            } catch {
                this.handleError(response, `The file does not exist. URI: ${uri}.`, NOT_FOUND);
                return;
            }
        }
        try {
            const downloadId = v4();
            const outputRootPath = await this.createTempDir(downloadId);
            const distinctUris = Array.from(new Set(body.uris.map(uri => new URI(uri))));
            const tarPaths = [];
            // We should have one key in the map per FS drive.
            for (const [rootUri, uris] of (await this.directoryArchiver.findCommonParents(distinctUris)).entries()) {
                const rootPath = FileUri.fsPath(rootUri);
                const entries = uris.map(FileUri.fsPath).map(p => path.relative(rootPath, p));
                const outputPath = path.join(outputRootPath, `${path.basename(rootPath) || 'root' }.tar`);
                await this.archive(rootPath, outputPath, entries);
                tarPaths.push(outputPath);
            }
            const options: PrepareDownloadOptions = { filePath: '', downloadId, remove: true, root: outputRootPath };
            if (tarPaths.length === 1) {
                // tslint:disable-next-line:whitespace
                const [outputPath,] = tarPaths;
                options.filePath = outputPath;
                await this.prepareDownload(request, response, options);
            } else {

                // We need to tar the tars.
                const outputPath = path.join(outputRootPath, `theia-archive-${Date.now()}.tar`);
                options.filePath = outputPath;
                await this.archive(outputRootPath, outputPath, tarPaths.map(p => path.relative(outputRootPath, p)));
                await this.prepareDownload(request, response, options);
            }
        } catch (e) {
            this.handleError(response, e, INTERNAL_SERVER_ERROR);
        }
    }

}
