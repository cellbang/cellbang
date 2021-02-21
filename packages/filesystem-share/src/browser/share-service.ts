import { Component, Value, Autowired, PostConstruct, Deferred, ContainerUtil } from '@malagu/core';
import { RestOperations, PathResolver, HttpHeaders, HttpStatus } from '@malagu/web';
import { Method, AxiosResponse } from 'axios';
import { parse } from 'querystring';
import { AUTHENTICATION_SCHEME_CB_SHARE, ShareServer, ShareService, SHARE_DOES_NOT_EXIST, SHARING_IS_OFF, X_CB_SHARE_ID } from '../common';
import { SharePasswordDialog } from './share-password-dialog';
import { ConfirmDialog } from '@theia/core/lib/browser';
import { IntlUtil } from '@cellbang/desktop/lib/browser';
import { Autorpc } from '@malagu/rpc';

@Component(ShareService)
export class ShareServiceImpl implements ShareService {

    @Autowired(RestOperations)
    protected restOperations: RestOperations;

    @Autorpc(ShareServer)
    protected readonly shareServer: ShareServer;

    @Value('cellbang.filesystem.share.checkShareStatusUrl')
    protected readonly checkShareStatusUrl: string;

    @Value('cellbang.filesystem.share.checkShareStatusMethod')
    protected readonly checkShareStatusMethod: string;

    @Autowired(PathResolver)
    protected readonly pathResolver: PathResolver;

    protected deferred = new Deferred<void>();

    @PostConstruct()
    protected async init(): Promise<void> {
        this.restOperations.interceptors.request.use(async request => {
            const shareId = this.getShareId();
            if (shareId && !request.headers[X_CB_SHARE_ID]) {
                request.headers[X_CB_SHARE_ID] = shareId;
                await this.deferred.promise;
            }

            return request;
        });
        this.restOperations.interceptors.response.use(response => response, async error => {
            if (error.response) {
                if (error.response.status === HttpStatus.UNAUTHORIZED &&
                    error.response.headers[HttpHeaders.WWW_AUTHENTICATE.toLowerCase()]?.startsWith(AUTHENTICATION_SCHEME_CB_SHARE)) {
                    if (error.response.data === SHARING_IS_OFF || error.response.data === SHARE_DOES_NOT_EXIST) {
                        const dialog = new ConfirmDialog({
                            title: IntlUtil.get('Prompt')!,
                            msg: IntlUtil.get(error.response.data)!,
                            cancel: IntlUtil.get('Cancel')!,
                            ok: IntlUtil.get('OK')!
                        });
                        dialog.node.style.zIndex = '60000';
                        dialog.open();
                    } else {
                        const dialog = ContainerUtil.get<SharePasswordDialog>(SharePasswordDialog);
                        try {
                            await dialog.open();
                        } catch (error2) {
                            throw error;
                        }
                        this.deferred.resolve();
                    }
                }
            }
            throw error;
        });

        await this.checkShareStatus();

    }

    async checkShareStatus(password?: string): Promise<AxiosResponse<string> | undefined> {
        const shareId = this.getShareId();
        const headers = password ? { [HttpHeaders.AUTHORIZATION]: `${AUTHENTICATION_SCHEME_CB_SHARE} ${btoa(password)}` } : {};
        if (shareId) {
            const response = await this.restOperations.request({
                url: await this.pathResolver.resolve(this.checkShareStatusUrl),
                method: this.checkShareStatusMethod as Method,
                headers: {
                    ...headers,
                    [X_CB_SHARE_ID]: shareId
                }
            });
            this.deferred.resolve();
            if (!window.location.hash) {
                const resource = await this.shareServer.getResource(shareId);
                window.location.hash = `#${resource}`;
                window.location.reload();
            }
            return response;
        }
        this.deferred.resolve();
    }

    getShareId() {
        return parse(location.search && location.search.substring(1))['share'] as string;
    }

}
