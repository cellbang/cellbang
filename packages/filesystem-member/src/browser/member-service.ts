import { Component, Value, Autowired, PostConstruct, Deferred, ContainerUtil, ContainerProvider } from '@malagu/core';
import { RestOperations, PathResolver } from '@malagu/web';
import { Method } from 'axios';
import { parse } from 'querystring';
import { MemberService, X_CB_JOIN_TOKEN, Collaboration, InvitationMeta, COLLABORATION_DOES_NOT_EXIST, COLLABORATION_IS_OFF, CollaborationServer } from '../common';
import { MemberJoinDialog } from './member-join-dialog';
import { ConfirmDialog } from '@theia/core/lib/browser';
import { IntlUtil } from '@cellbang/desktop/lib/browser';
import { Autorpc } from '@malagu/rpc';

@Component(MemberService)
export class MemberServiceImpl implements MemberService {

    @Autowired(RestOperations)
    protected restOperations: RestOperations;

    @Autorpc(CollaborationServer)
    protected collaborationServer: CollaborationServer;

    @Value('cellbang.filesystem.member.getMemberStatusUrl')
    protected readonly getMemberStatusUrl: string;

    @Value('cellbang.filesystem.member.getMemberStatusMethod')
    protected readonly getMembertatusMethod: string;

    @Autowired(PathResolver)
    protected readonly pathResolver: PathResolver;

    protected deferred = new Deferred<Collaboration>();

    @PostConstruct()
    protected async init(): Promise<void> {
        this.restOperations.interceptors.response.use(response => response, async error => {
            if (error.response) {
                if (error.response.data === COLLABORATION_DOES_NOT_EXIST || error.response.data === COLLABORATION_IS_OFF) {
                    const dialog = new ConfirmDialog({
                        title: IntlUtil.get('Prompt')!,
                        msg: IntlUtil.get(error.response.data)!,
                        cancel: IntlUtil.get('Cancel')!,
                        ok: IntlUtil.get('OK')!
                    });
                    dialog.node.style.zIndex = '60000';
                    dialog.open();
                }
            }
            throw error;
        });
        const invitationMata = await this.getInvitationMeta();
        if (invitationMata) {
            ContainerProvider.provide().bind(InvitationMeta).toConstantValue(invitationMata);
            const dialog = ContainerUtil.get<MemberJoinDialog>(MemberJoinDialog);
            dialog.open();
        }

        const slug = this.getSlug();
        if (slug && !window.location.hash) {
            const resource = await this.collaborationServer.getResource(slug);
            window.location.hash = `#${resource}`;
            window.location.reload();
        }

    }

    async getInvitationMeta(): Promise<InvitationMeta | undefined> {
        const token = this.getToken();
        if (token) {
            const response = await this.restOperations.request<InvitationMeta>({
                url: await this.pathResolver.resolve(this.getMemberStatusUrl),
                method: this.getMembertatusMethod as Method,
                headers: {
                    [X_CB_JOIN_TOKEN]: token
                }
            });
            return response.data;
        }
    }

    getToken() {
        return parse(location.search && location.search.substring(1))['join'] as string;
    }

    getSlug() {
        return parse(location.search && location.search.substring(1))['slug'] as string;
    }

}
