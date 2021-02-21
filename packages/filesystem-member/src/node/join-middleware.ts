import { Context, Middleware, RequestMatcher } from '@malagu/web/lib/node';
import { Component, Autowired, Value } from '@malagu/core';
import { UrlUtil } from '@malagu/web';
import { MemberServer, CollaborationServer, COLLABORATION_DOES_NOT_EXIST, COLLABORATION_IS_OFF, X_CB_JOIN_TOKEN, Member } from '../common';
import { SECURITY_CONTEXT_MIDDLEWARE_PRIORITY, SecurityContext } from '@malagu/security/lib/node';
import { CollaborationDisabledError, CollaborationNotFoundError } from './error';
import { FileRepository } from '@cellbang/filesystem-entity/lib/node';

@Component(Middleware)
export class ShareMiddleware implements Middleware {

    @Value('cellbang.filesystem.member.getMemberStatusUrl')
    protected readonly getMemberStatusUrl: string;

    @Value('cellbang.filesystem.member.getMemberStatusMethod')
    protected readonly getMembertatusMethod: string;

    @Autowired(MemberServer)
    protected readonly memberServer: MemberServer;

    @Autowired(CollaborationServer)
    protected readonly collaborationServer: CollaborationServer;

    @Autowired(FileRepository)
    protected readonly fileRepository: FileRepository;

    @Autowired(RequestMatcher)
    protected readonly requestMatcher: RequestMatcher;

    async handle(ctx: Context, next: () => Promise<void>): Promise<void> {
        const token = ctx.request.header(X_CB_JOIN_TOKEN);
        if (token) {
            const auth = SecurityContext.getAuthentication();
            const collaboration = await this.collaborationServer.getByToken(token);
            if (collaboration) {
                if (collaboration.disabled) {
                    throw new CollaborationDisabledError(COLLABORATION_IS_OFF);
                }
                let member: Member | undefined;
                if (!collaboration.approval) {
                    member = await this.memberServer.agree(collaboration.fileId, auth.name);
                } else {
                    member = await this.memberServer.get(collaboration.fileId, auth.name);
                }
                const stat = await this.fileRepository.get(collaboration.fileId);
                ctx.response.setHeader(X_CB_JOIN_TOKEN, token);
                ctx.response.body = JSON.stringify({
                    member, collaboration, resource: stat.resource, isDirectory: stat.isDirectory
                });
            } else {
                throw new CollaborationNotFoundError(COLLABORATION_DOES_NOT_EXIST);
            }
            if (await this.canHandle()) {
                return;
            }
        }
        await next();
    }

    async canHandle(): Promise<boolean> {
        return !!await this.requestMatcher.match(await UrlUtil.getPath(this.getMemberStatusUrl), this.getMembertatusMethod);
    }

    readonly priority = SECURITY_CONTEXT_MIDDLEWARE_PRIORITY - 10;

}
