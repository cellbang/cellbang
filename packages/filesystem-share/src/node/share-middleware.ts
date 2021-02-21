import { Context, Middleware, AttributeScope, RequestMatcher } from '@malagu/web/lib/node';
import { SECURITY_CONTEXT_MIDDLEWARE_PRIORITY } from '@malagu/security/lib/node';
import { Component, Autowired, Value } from '@malagu/core';
import { AUTHENTICATION_SCHEME_CB_SHARE, ShareServer, SHARE_DOES_NOT_EXIST, SHARING_IS_OFF, X_CB_SHARE_ID } from '../common';
import { HttpHeaders, PathResolver } from '@malagu/web';
import { ShareAuthenticationError, ShareNotFoundError } from './error';
import { parse } from 'querystring';

export const CURRENT_SHARE_REQUEST_KEY = 'CurrentShareRequest';

@Component(Middleware)
export class ShareMiddleware implements Middleware {

    @Value('cellbang.filesystem.share.checkShareStatusUrl')
    protected readonly checkShareStatusUrl: string;

    @Value('cellbang.filesystem.share.checkShareStatusMethod')
    protected readonly checkShareStatusMethod: string;

    @Autowired(ShareServer)
    protected readonly shareServer: ShareServer;

    @Autowired(PathResolver)
    protected readonly pathResolver: PathResolver;

    @Autowired(RequestMatcher)
    protected readonly requestMatcher: RequestMatcher;

    async handle(ctx: Context, next: () => Promise<void>): Promise<void> {
        const search = (ctx.request.get(HttpHeaders.REFERER) || '').split('?').pop();
        const shareId = ctx.request.get(X_CB_SHARE_ID) || ctx.request.query.share as string || search && parse(search).share as string;
        if (shareId) {
            this.savePasswordIfNeed(shareId);
            const share = await this.shareServer.get(shareId);
            if (share) {
                if (share.disabled) {
                    throw new ShareAuthenticationError(SHARING_IS_OFF);
                }
                Context.setTenant(share.tenant);
                if (share.password) {
                    const password = Context.getAttr(shareId, AttributeScope.Session);
                    if (!password) {
                        throw new ShareAuthenticationError('Need Password');
                    }
                    if (password === share.password) {
                        Context.setAttr(CURRENT_SHARE_REQUEST_KEY, share, AttributeScope.Request);
                    } else {
                        delete Context.getSession()[shareId];
                        throw new ShareAuthenticationError('Password is wrong');
                    }
                } else {
                    Context.setAttr(CURRENT_SHARE_REQUEST_KEY, share, AttributeScope.Request);
                }
            } else {
                throw new ShareNotFoundError(SHARE_DOES_NOT_EXIST);
            }
            if (await this.canHandle()) {
                return;
            }
        }
        await next();
    }

    protected savePasswordIfNeed(shareId: string): boolean {
        const request = Context.getRequest();
        let header = request.get(HttpHeaders.AUTHORIZATION);
        if (!header) {
            return false;
        }
        header = header.trim();
        if (header.toLowerCase().startsWith(AUTHENTICATION_SCHEME_CB_SHARE.toLowerCase())) {
            const password = Buffer.from(header.substring(9), 'base64').toString('utf8');
            Context.setAttr(shareId, password, AttributeScope.Session);
            return true;
        }
        return false;
    }

    async canHandle(): Promise<boolean> {
        return !!await this.requestMatcher.match(await this.pathResolver.resolve(this.checkShareStatusUrl), this.checkShareStatusMethod);
    }

    readonly priority = SECURITY_CONTEXT_MIDDLEWARE_PRIORITY - 10;

}
