import URI from '@theia/core/lib/common/uri';
import { FileDownloadService } from '@theia/filesystem/lib/browser/download/file-download-service';
import { Component, Autowired } from '@malagu/core';
import { RestOperations, MediaType, HttpHeaders, HttpMethod, UrlUtil } from '@malagu/web';
import { addClipboardListener } from '@theia/core/lib/browser/widgets';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { IntlUtil } from '@cellbang/desktop/lib/browser';

@Component({ id: FileDownloadService, rebind: true })
export class FileDownloadServiceExt extends FileDownloadService {

    @Autowired(RestOperations)
    protected readonly restOperations: RestOperations;

    async cancelDownload(id: string): Promise<void> {
        await this.restOperations.get(`${await this.getUrl()}/download/?id=${id}&cancel=true`);
    }

    protected async getUrl() {
        return UrlUtil.getUrl('files');
    }

    protected async getConfig(uris: URI[]) {
        if (uris.length === 1) {
            return <AxiosRequestConfig>{
                url: `${await this.getUrl()}/?uri=${uris[0].toString()}`,
                method: HttpMethod.GET
            };
        }
        return <AxiosRequestConfig>{
            url: await this.getUrl(),
            method: HttpMethod.POST,
            data: this.body(uris),
            headers: {
                [HttpHeaders.CONTENT_TYPE]: MediaType.APPLICATION_JSON
            }
        };
    }

    async download(uris: URI[], options?: FileDownloadService.DownloadOptions): Promise<void> {
        let cancel = false;
        if (uris.length === 0) {
            return;
        }
        const copyLink = options && options.copyLink ? true : false;
        try {
            const [progress, result] = await Promise.all([
                this.messageService.showProgress({
                    text: `${IntlUtil.get('Preparing download')}${copyLink ? ` ${IntlUtil.get('link')}` : ''}...`, options: { cancelable: true }
                }, () => { cancel = true; }),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                new Promise<{ response: AxiosResponse, jsonResponse: any }>(async resolve => {
                    const resp = await this.restOperations.request(await this.getConfig(uris));
                    const jsonResp = resp.data;
                    resolve({ response: resp, jsonResponse: jsonResp });
                })
            ]);
            const { response, jsonResponse } = result;
            if (cancel) {
                this.cancelDownload(jsonResponse.id);
                return;
            }
            const { status, statusText } = response;
            if (status === 200) {
                progress.cancel();
                const downloadUrl = `${await this.getUrl()}/download/?id=${jsonResponse.id}`;
                if (copyLink) {
                    if (document.documentElement) {
                        const toDispose = addClipboardListener(document.documentElement, 'copy', e => {
                            toDispose.dispose();
                            this.handleCopy(e, downloadUrl);
                        });
                        document.execCommand('copy');
                    }
                } else {
                    this.forceDownload(jsonResponse.id, decodeURIComponent(jsonResponse.name));
                }
            } else {
                throw new Error(`Received unexpected status code: ${status}. [${statusText}]`);
            }
        } catch (e) {
            this.logger.error(`Error occurred when downloading: ${uris.map(u => u.toString(true))}.`, e);
        }
    }

    protected async forceDownload(id: string, title: string): Promise<void> {
        let url: string | undefined;
        try {
            if (this.anchor === undefined) {
                this.anchor = document.createElement('a');
            }
            const endpoint = await this.getUrl();
            url = `${endpoint}/download/?id=${id}`;
            this.anchor.href = url;
            this.anchor.style.display = 'none';
            this.anchor.download = title;
            document.body.appendChild(this.anchor);
            this.anchor.click();
        } finally {
            // make sure anchor is removed from parent
            if (this.anchor && this.anchor.parentNode) {
                this.anchor.parentNode.removeChild(this.anchor);
            }
            if (url) {
                URL.revokeObjectURL(url);
            }
        }
    }

}
