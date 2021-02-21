import { Component, Autowired } from '@malagu/core';
import { Autorpc } from '@malagu/rpc';
import { AbstractDialog, DialogProps, LabelProvider } from '@theia/core/lib/browser';
import { IntlUtil } from '@cellbang/desktop/lib/browser';
import { InvitationMeta, MemberServer, MemberStatus } from '../common';
import { UrlUtil } from '@malagu/web';
import URI from '@theia/core/lib/common/uri';
import { COLLABORATION_WORKSPACE_PATH_CLASS } from './collaboration-dialog';

export const MEMBER_JOIN_DIALOG_CLASS = 'cellbang-MemberJoinDialog';

@Component({ onActivation: ctx => <MemberJoinDialogProps>{
        title: IntlUtil.get('Apply join collaboration'),
        confirmButtonLabel: IntlUtil.get('OK')
    }
})
export class MemberJoinDialogProps extends DialogProps {

}

@Component(MemberJoinDialog)
export class MemberJoinDialog extends AbstractDialog<void> {
    readonly value: void;

    constructor(
        @Autowired(MemberJoinDialogProps) protected readonly props: MemberJoinDialogProps,
        @Autorpc(MemberServer) protected readonly memberServer: MemberServer,
        @Autowired(InvitationMeta) protected readonly invitationMeta: InvitationMeta,
        @Autowired(LabelProvider) protected readonly labelProvider: LabelProvider
    ) {
        super(props);
        this.appendWorkspacePath();
        this.appendMessage();
        this.appendAcceptButton(IntlUtil.get('Apply'));
        this.addClass(MEMBER_JOIN_DIALOG_CLASS);
        this.refresh();
    }

    protected async refresh() {
        const { member, collaboration, resource } = this.invitationMeta;
        this.acceptButton!.disabled = false;
        if (!member) {
            this.acceptButton!.textContent = IntlUtil.get('Apply')!;
        } else if (member.status === MemberStatus.applying) {
            this.acceptButton!.textContent = IntlUtil.get('Already applied')!;
            this.acceptButton!.disabled = true;
        } else {
            window.location.href = `${await UrlUtil.getUrl()}?slug=${collaboration.slug}#${resource}`;
        }
    }

    protected async accept(): Promise<void> {
        const { collaboration } = this.invitationMeta;
        this.invitationMeta.member = await this.memberServer.apply(collaboration.fileId);
        this.refresh();
    }

    protected appendMessage(): void {
        const title = document.createElement('div');
        title.classList.add('title');
        title.appendChild(document.createTextNode(IntlUtil.get('You will get the following permissions:')!));
        const item1 = document.createElement('div');
        item1.classList.add('item');
        item1.appendChild(document.createTextNode(IntlUtil.get('All content viewing permissions for the workspace')!));
        const item2 = document.createElement('div');
        item2.classList.add('item');
        item2.appendChild(document.createTextNode(IntlUtil.get('Create and edit permissions for the directory and its contents')!));
        this.contentNode.appendChild(title);
        this.contentNode.appendChild(item1);
        this.contentNode.appendChild(item2);

    }

    protected appendWorkspacePath(): void {
        const label = this.labelProvider.getLongName(new URI(`file://${this.invitationMeta.resource}`));
        const element = document.createElement('div');
        element.classList.add(COLLABORATION_WORKSPACE_PATH_CLASS);
        const icon = document.createElement('i');
        icon.classList.add('fa', this.invitationMeta.isDirectory ? 'fa-folder' : 'fa-file');
        element.appendChild(icon);
        element.appendChild(document.createTextNode(label));
        this.contentNode.appendChild(element);
    }

    protected async validate() {}

}
