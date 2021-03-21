import { Context, Middleware, AttributeScope } from '@malagu/web/lib/node';
import { SECURITY_CONTEXT_MIDDLEWARE_PRIORITY } from '@malagu/security/lib/node';
import { Component, Autowired, Named } from '@malagu/core';
import { CollaborationServer, Collaboration, COLLABORATION_DOES_NOT_EXIST, COLLABORATION_IS_OFF, X_CB_SLUG } from '../common';
import { HttpHeaders } from '@malagu/web';
import { CollaborationDisabledError, CollaborationNotFoundError } from './error';
import { parse } from 'querystring';
import { CacheManager } from '@malagu/cache';

export const CURRENT_COLLABORATION_REQUEST_KEY = 'CurrentCollaborationRequest';

@Component(Middleware)
export class SlugMiddleware implements Middleware {

    @Autowired(CollaborationServer)
    protected readonly collaborationServer: CollaborationServer;

    @Autowired(CacheManager)
    @Named('filesystem-member')
    protected readonly cacheManager: CacheManager;

    async handle(ctx: Context, next: () => Promise<void>): Promise<void> {
        const search = (ctx.request.get(HttpHeaders.REFERER) || '').split('?').pop();
        const slug = ctx.request.get(X_CB_SLUG) || ctx.request.query.slug as string || search && parse(search).slug as string;
        if (slug) {
            const collaboration = await this.cacheManager.wrap<Collaboration>(`getBySlug:${slug}`, () => this.collaborationServer.getBySlug(slug));

            if (collaboration) {
                if (collaboration.disabled) {
                    throw new CollaborationDisabledError(COLLABORATION_IS_OFF);
                }
                Context.setTenant(collaboration.tenant);
                Context.setAttr(CURRENT_COLLABORATION_REQUEST_KEY, collaboration, AttributeScope.Request);
            } else {
                throw new CollaborationNotFoundError(COLLABORATION_DOES_NOT_EXIST);
            }
        }
        await next();
    }

    readonly priority = SECURITY_CONTEXT_MIDDLEWARE_PRIORITY - 10;

}
