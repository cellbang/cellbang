import URI from '@theia/core/lib/common/uri';
import { checkCancelled, cancelled } from '@theia/core/lib/common/cancellation';
import { Deferred } from '@theia/core/lib/common/promise-util';
import { RestOperations, ENDPOINT, PathResolver, MediaType, HttpHeaders } from '@malagu/web';
import { Component, Autowired, Value } from '@malagu/core';
import { v4 } from 'uuid';
import throttle = require('lodash.throttle');
import { FileUploadResult, FileUploadService } from '@theia/filesystem/lib/browser/file-upload-service';
import { RemoteFileSystemProvider } from '@theia/filesystem/lib/common/remote-file-system-provider';
import { RemoteFileSystemProviderExt } from './remote-file-system-provider';
import { FileChangeType } from '@theia/filesystem/lib/common/filesystem-watcher-protocol';

@Component({ id: FileUploadService, rebind: true })
export class FileUploadServiceExt extends FileUploadService {

    @Autowired(RestOperations)
    protected readonly restOperations: RestOperations;

    @Autowired(PathResolver)
    protected readonly pathResolver: PathResolver;

    @Value(ENDPOINT)
    protected readonly endpoint: string;

    @Autowired(RemoteFileSystemProvider)
    protected readonly remoteFileSystemProvider: RemoteFileSystemProviderExt;

    protected async getUrl() {
        return this.pathResolver.resolve(this.endpoint, await this.pathResolver.resolve(`file-upload?id=${v4()}`));
    }

    protected async exists(resource: URI): Promise<boolean> {
        try {
            const stat = await this.remoteFileSystemProvider.stat(resource);

            return !!stat;
        } catch (error) {
            return false;
        }
    }

    protected async doUpload(targetUri: URI, { source, progress, token, onDidUpload }: FileUploadService.UploadParams): Promise<FileUploadResult> {
        const result: FileUploadResult = { uploaded: [] };
        let total = 0;
        let done = 0;
        let totalFiles = 0;
        let doneFiles = 0;
        const folderMap = new Map<string, boolean>();
        const url = await this.getUrl();
        const reportProgress = throttle(() => progress.report({
            message: `${doneFiles} out of ${totalFiles}`,
            work: { done, total }
        }), 60);
        const deferredUpload = new Deferred<FileUploadResult>();
        const callback = async (response: any) => {
            if (response.uri) {
                doneFiles++;
                done += response.done;
                result.uploaded.push(response.uri);
                await this.restOperations.post(url, { ok: true }, { headers: { [HttpHeaders.CONTENT_TYPE]: MediaType.APPLICATION_JSON_UTF8 } });
                if (!folderMap.get(new URI(response.uri).parent.toString())) {
                    this.remoteFileSystemProvider.emitter.fire([{ type: FileChangeType.ADDED, resource: new URI(response.uri).parent }]);
                }
                this.remoteFileSystemProvider.emitter.fire([{ type: FileChangeType.ADDED, resource: new URI(response.uri) }]);
                reportProgress();
                if (onDidUpload) {
                    onDidUpload(response.uri);
                }
                if (doneFiles === totalFiles) {
                    deferredUpload.resolve(result);
                }
                return;
            }
            if (response.done) {
                done += response.done;
                reportProgress();
                return;
            }
            if (response.error) {
                deferredUpload.reject(new Error(response.error));
            }
        };
        const rejectAndClose = (e: Error) => {
            deferredUpload.reject(e);
        };
        token.onCancellationRequested(() => rejectAndClose(cancelled()));
        try {
            let queue = Promise.resolve();
            await this.index(targetUri, source, {
                token,
                progress,
                accept: async ({ uri, file }) => {
                    total += file.size;
                    totalFiles++;
                    reportProgress();
                    queue = queue.then(async () => {
                        try {
                            checkCancelled(token);
                            let readBytes = 0;
                            if (!folderMap.has(uri.parent.toString())) {
                                folderMap.set(uri.parent.toString(), await this.exists(uri.parent));
                            }

                            const res = await this.restOperations.post(url,
                                { uri: uri.toString(), size: file.size },
                                { headers: { [HttpHeaders.CONTENT_TYPE]: MediaType.APPLICATION_JSON_UTF8 }
                            });
                            await callback(res.data);
                            if (file.size) {
                                do {
                                    const fileSlice = await this.readFileSlice(file, readBytes);
                                    checkCancelled(token);
                                    readBytes = fileSlice.read;
                                    const response =  await this.restOperations.post(url,
                                        fileSlice.content,
                                        { headers: { [HttpHeaders.CONTENT_TYPE]: MediaType.APPLICATION_OCTET_STREAM }
                                    });
                                    await callback(response.data);
                                    checkCancelled(token);
                                } while (readBytes < file.size);
                            }
                        } catch (e) {
                            rejectAndClose(e);
                        }
                    });
                }
            });
            await queue;
        } catch (e) {
            rejectAndClose(e);
        }
        return deferredUpload.promise;
    }
}
