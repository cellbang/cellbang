import { FileStatWithContent, MiniBrowserEndpoint, MiniBrowserEndpointHandler } from '@theia/mini-browser/lib/node/mini-browser-endpoint';
import { Autowired, ApplicationLifecycle } from '@malagu/core';
import { BackendApplication } from '@malagu/core/lib/node';
import { Context, HandlerAdapter, RequestMatcher, Response, Request } from '@malagu/web/lib/node';
import { MVC_HANDLER_ADAPTER_PRIORITY } from '@malagu/mvc/lib/node';
import { Rpc } from '@malagu/rpc';
import { Component } from '@malagu/core';
import { UrlUtil } from '@malagu/web';
import { MiniBrowserService } from '@theia/mini-browser/lib/common/mini-browser-service';
import {  } from '@cellbang/filesystem/lib/node';
import { FileUri } from '@theia/core/lib/node/file-uri';
import { lookup } from 'mime-types';
import { MaybePromise } from '@theia/core/lib/common/types';
import URI from '@theia/core/lib/common/uri';
import { FileRepository } from '@cellbang/filesystem-entity/lib/node';
import { FileSystemProvider } from '@theia/filesystem/lib/common/files';
import { ResourceNotFoundError } from '@cellbang/entity/lib/node';

const CODE_EDITOR_PRIORITY = 100;

@Rpc({ id: [MiniBrowserService, HandlerAdapter, ApplicationLifecycle], rebind: true, proxy: false})
export class MiniBrowserEndpointExt extends MiniBrowserEndpoint implements HandlerAdapter, ApplicationLifecycle<BackendApplication> {
    readonly priority = MVC_HANDLER_ADAPTER_PRIORITY + 10;

    @Autowired(RequestMatcher)
    protected readonly requestMatcher: RequestMatcher;

    @Autowired(FileSystemProvider)
    protected readonly fileSystemProvider: FileSystemProvider;

    @Autowired(FileRepository)
    protected readonly fileRepository: FileRepository;

    async canHandle(): Promise<boolean> {
        return this.requestMatcher.match(await UrlUtil.getPath('/mini-browser/*'));
    }

    async handle(): Promise<void> {
        Context.setSkipAutoEnd(true);
        await this.response(await this.getUri(Context.getRequest() as any), Context.getResponse() as any);
    }

    protected getUri(request: Request): MaybePromise<string> {
        const decodedPath = request.path.substr('/mini-browser/'.length);
        return new URI(FileUri.create(decodedPath).toString(true)).path.toString();
    }

    protected async response(uri: string, response: Response): Promise<Response> {
        try {
            await this.fileSystemProvider.stat(FileUri.create(uri));
        } catch (error) {
            if (error instanceof ResourceNotFoundError) {
                return this.missingResourceHandler()(uri, response);
            }
            throw error;
        }
        const statWithContent = await this.readContent(uri);
        try {
            if (!statWithContent.stat.isDirectory()) {
                const extension = uri.split('.').pop();
                if (!extension) {
                    return this.defaultHandler()(statWithContent, response);
                }
                const handler = this.handlers.get(extension.toString().toLocaleLowerCase());
                if (!handler) {
                    return this.defaultHandler()(statWithContent, response);
                }
                return handler.respond(statWithContent, response);
            }
        } catch (e) {
            return this.errorHandler()(e, uri, response);
        }
        return this.defaultHandler()(statWithContent, response);
    }

    protected defaultHandler(): (statWithContent: FileStatWithContent, response: Response) => MaybePromise<Response> {
        return async (statWithContent: FileStatWithContent, response: Response) => {
            const content = await this.fileRepository.readFileStream(statWithContent.stat.uri);
            const mimeType = lookup(FileUri.fsPath(statWithContent.stat.uri));
            if (!mimeType) {
                this.logger.warn(`Cannot handle unexpected resource. URI: ${statWithContent.stat.uri}.`);
                response.contentType('application/octet-stream');
            } else {
                response.contentType(mimeType);
            }
            response.setHeader('Content-Length', statWithContent.stat.size);
            return response.send(content);
        };
    }

    protected async readContent(uri: string): Promise<FileStatWithContent> {
        const stat = await this.fileRepository.stat(uri);
        return { stat: Object.assign({
            isDirectory: () => stat.isDirectory,
            isFile: () => stat.isFile, uri, size: stat.size

        }), content: '' };
    }

}

export abstract class AbstractMiniBrowserEndpointHandler implements MiniBrowserEndpointHandler {

    @Autowired(FileRepository)
    protected fileRepository: FileRepository;

    priority(): number {
        return CODE_EDITOR_PRIORITY + 5;
    }

    protected async doRespond(statWithContent: FileStatWithContent, response: Response) {
        const content = await this.fileRepository.readFileStream(statWithContent.stat.uri);
        response.setHeader('Content-Length', statWithContent.stat.size);
        return new Promise<Response>((resolve, reject) => {
            content.on('error', error => {
                reject(error);
            });
            response.on('error', error => {
                reject(error);
            });
            response.on('close', () => {
                content.destroy();
            });
            content.pipe(response);
            resolve(response);
        });
    }

    abstract supportedExtensions(): MaybePromise<string | string[]>;
    abstract respond(statWithContent: FileStatWithContent, response: Response): MaybePromise<Response>;
}

@Component(MiniBrowserEndpointHandler)
export class HtmlHandler extends AbstractMiniBrowserEndpointHandler {

    supportedExtensions(): string[] {
        return ['html', 'xhtml', 'htm'];
    }

    priority(): number {
        // Prefer Code Editor over Mini Browser
        // https://github.com/eclipse-theia/theia/issues/2051
        return 5;
    }

    respond(statWithContent: FileStatWithContent, response: Response): MaybePromise<Response> {
        response.contentType('text/html');
        return this.doRespond(statWithContent, response);
    }

}

/**
 * Handler for JPG resources.
 */
@Component(MiniBrowserEndpointHandler)
export class ImageHandler extends AbstractMiniBrowserEndpointHandler {

    @Autowired(FileRepository)
    protected fileRepository: FileRepository;

    supportedExtensions(): string[] {
        return ['jpg', 'jpeg', 'png', 'bmp', 'gif'];
    }

    respond(statWithContent: FileStatWithContent, response: Response): MaybePromise<Response> {
        response.contentType('image/jpeg');
        return this.doRespond(statWithContent, response);
    }

}

/**
 * PDF endpoint handler.
 */
@Component(MiniBrowserEndpointHandler)
export class PdfHandler extends AbstractMiniBrowserEndpointHandler {

    supportedExtensions(): string {
        return 'pdf';
    }

    respond(statWithContent: FileStatWithContent, response: Response): MaybePromise<Response> {
        // https://stackoverflow.com/questions/11598274/display-pdf-in-browser-using-express-js
        const encodeRFC5987ValueChars = (input: string) =>
            encodeURIComponent(input).
                // Note that although RFC3986 reserves "!", RFC5987 does not, so we do not need to escape it.
                replace(/['()]/g, escape). // i.e., %27 %28 %29
                replace(/\*/g, '%2A').
                // The following are not required for percent-encoding per RFC5987, so we can allow for a little better readability over the wire: |`^.
                replace(/%(?:7C|60|5E)/g, unescape);

        const fileName = FileUri.create(statWithContent.stat.uri).path.base;
        response.setHeader('Content-disposition', `inline; filename*=UTF-8''${encodeRFC5987ValueChars(fileName)}`);
        response.contentType('application/pdf');
        return this.doRespond(statWithContent, response);
    }

}

/**
 * Endpoint contribution for SVG resources.
 */
@Component(MiniBrowserEndpointHandler)
export class SvgHandler extends AbstractMiniBrowserEndpointHandler {

    supportedExtensions(): string {
        return 'svg';
    }

    respond(statWithContent: FileStatWithContent, response: Response): MaybePromise<Response> {
        response.contentType('image/svg+xml');
        return this.doRespond(statWithContent, response);
    }

}

