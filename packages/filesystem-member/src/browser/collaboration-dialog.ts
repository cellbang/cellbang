import { Message } from '@phosphor/messaging';
import { Key } from '@theia/core/lib/browser/keyboard/keys';
import { LabelProvider } from '@theia/core/lib/browser';
import { AbstractDialog, DialogProps, SingleTextInputDialog } from '@theia/core/lib/browser/dialogs';
import { Autowired } from '@malagu/core';
import { FileStat } from '@theia/filesystem/lib/common/files';
import { IntlUtil } from '@cellbang/desktop/lib/browser';
import { Collaboration, CollaborationServer } from '../common';
import { FileUri } from '@theia/core/lib/node/file-uri';
import { ClipboardService } from '@theia/core/lib/browser/clipboard-service';
import { MessageService } from '@theia/core';

export const COLLABORATION_MESSAGE_CLASS = 'cellbang-CollaborationMessage';
export const COLLABORATION_LINK_CLASS = 'cellbang-CollaborationLink';
export const COLLABORATION_EDIT_SLUG_ICON_CLASS = 'cellbang-CollaborationEditSlugIcon';
export const COLLABORATION_INVITING_LINK_CLASS = 'cellbang-CollaborationInvitingLink';
export const COLLABORATION_APPROVAL_CHECK_BOX_CLASS = 'cellbang-CollaborationApprovalCheckBox';
export const COLLABORATION_PASSWORD_AREA_CLASS = 'cellbang-CollaborationPasswordArea';
export const COLLABORATION_RESET_PASSWORD_CLASS = 'cellbang-CollaborationResetPassword';
export const COLLABORATION_COPY_CLASS = 'cellbang-CollaborationCopy';
export const COLLABORATION_WORKSPACE_PATH_CLASS = 'cellbang-CollaborationWorkspacePath';
export const COLLABORATION_HIDDEN_CLASS = 'cellbang-CollaborationHidden';

export class CollaborationDialogProps extends DialogProps {
    readonly title: string;
    readonly fileStat: FileStat;
}

export class CollaborationDialog extends AbstractDialog<void> {
    readonly value: void;

    protected turnOnContainer: HTMLDivElement;
    protected turnOffContainer: HTMLDivElement;

    protected turnOnCollaborationButton: HTMLButtonElement;
    protected turnOffCollaborationButton: HTMLButtonElement;
    protected copyCollaborationLinkButton: HTMLButtonElement;
    protected copyInvitingLinkButton: HTMLButtonElement;
    protected collaborationLinkInput: HTMLInputElement;
    protected slugInput: HTMLInputElement;
    protected editSlugIcon: HTMLElement;
    protected invitingLinkInput: HTMLInputElement;
    protected approvalCheckBox: HTMLInputElement;
    protected passwordLabel: HTMLLabelElement;
    protected resetToken: HTMLLabelElement;

    protected collaboration: Collaboration | undefined;

    constructor(
        protected readonly props: CollaborationDialogProps,
        @Autowired(LabelProvider) protected readonly labelProvider: LabelProvider,
        @Autowired(CollaborationServer) protected readonly collaborationServer: CollaborationServer,
        @Autowired(ClipboardService) protected readonly clipboardService: ClipboardService,
        @Autowired(MessageService) protected readonly messageService: MessageService
    ) {
        super({
            title: props.title,

        });
        this.appendWorkspacePath();
        this.appendTurnOffContainer();
        this.appendTurnOnContainer();
        this.loadCollaboration();
    }

    protected hideElement(element: HTMLElement) {
        element.classList.add(COLLABORATION_HIDDEN_CLASS);
    }

    protected showElement(element: HTMLElement) {
        element.classList.remove(COLLABORATION_HIDDEN_CLASS);
    }

    protected refresh() {
        if (this.collaboration && this.collaboration.disabled === false ) {
            this.hideElement(this.turnOffContainer);
            this.hideElement(this.turnOnCollaborationButton);
            this.showElement(this.turnOnContainer);
            this.showElement(this.turnOffCollaborationButton);
            this.collaborationLinkInput.value =
                `${location.protocol}//${location.host}${location.pathname}?slug=${this.collaboration.slug}`;
            this.invitingLinkInput.value = `${location.protocol}//${location.host}${location.pathname}?join=${this.collaboration.token}`;
            this.approvalCheckBox.checked = this.collaboration.approval;
        } else {
            this.hideElement(this.turnOnContainer);
            this.hideElement(this.turnOffCollaborationButton);
            this.showElement(this.turnOffContainer);
            this.showElement(this.turnOnCollaborationButton);
        }
    }

    async loadCollaboration() {
        this.collaboration = await this.collaborationServer.getByResource(FileUri.fsPath(this.props.fileStat.resource));
        this.refresh();
    }

    protected appendTurnOffContainer(): void {
        this.turnOffContainer = document.createElement('div');
        this.turnOffContainer.classList.add(COLLABORATION_HIDDEN_CLASS);
        this.contentNode.appendChild(this.turnOffContainer);
        this.appendMessageAfterTurningOn('Turn on to collaborate knowledges with others via a link');
        this.appendTurnOnCollaborationButton();

    }

    protected appendTurnOnContainer(): void {
        this.turnOnContainer = document.createElement('div');
        this.turnOnContainer.classList.add(COLLABORATION_HIDDEN_CLASS);
        this.contentNode.appendChild(this.turnOnContainer);
        this.appendMessageAfterTurningOff('Members who gets the link can access this Document');
        this.appendCollaborationLink();
        this.appendMessageAfterTurningOff('Invite collaborators by links');
        this.appendInvitingLink();
        this.appendApprovalCheckBox();
        this.appendTurnOffCollaborationButton();
    }

    protected appendWorkspacePath(): void {
        const stat = this.props.fileStat;
        const label = this.labelProvider.getLongName(stat.resource);
        const element = document.createElement('div');
        element.classList.add(COLLABORATION_WORKSPACE_PATH_CLASS);
        const icon = document.createElement('i');
        icon.classList.add('fa', stat.isDirectory ? 'fa-folder' : 'fa-file');
        element.appendChild(icon);
        element.appendChild(document.createTextNode(label));
        this.contentNode.appendChild(element);
    }

    protected appendMessageAfterTurningOff(message: string): void {
        const element = document.createElement('div');
        element.classList.add(COLLABORATION_MESSAGE_CLASS);
        element.appendChild(document.createTextNode(IntlUtil.get(message)!));
        this.turnOnContainer.appendChild(element);
    }

    protected appendMessageAfterTurningOn(message: string): void {
        const element = document.createElement('div');
        element.classList.add(COLLABORATION_MESSAGE_CLASS);
        element.appendChild(document.createTextNode(IntlUtil.get(message)!));
        this.turnOffContainer.appendChild(element);
    }

    protected appendCollaborationLink(): void {
        const element = document.createElement('div');
        element.classList.add(COLLABORATION_LINK_CLASS, 'theia-input');
        this.collaborationLinkInput = document.createElement('input');
        this.collaborationLinkInput.type = 'text';
        this.collaborationLinkInput.className = 'theia-input';
        this.collaborationLinkInput.setAttribute('style', 'flex: 0;');
        this.collaborationLinkInput.disabled = true;
        this.copyCollaborationLinkButton = this.createButton(IntlUtil.get('Copy link')!);
        this.copyCollaborationLinkButton.classList.add(COLLABORATION_COPY_CLASS);
        this.editSlugIcon = document.createElement('i');
        this.editSlugIcon.classList.add('fa', 'fa-pencil', COLLABORATION_EDIT_SLUG_ICON_CLASS);
        this.editSlugIcon.style.marginRight = '0.5em';
        element.appendChild(this.collaborationLinkInput);
        element.appendChild(this.editSlugIcon);
        element.appendChild(this.copyCollaborationLinkButton);
        this.turnOnContainer.appendChild(element);
    }

    protected appendInvitingLink(): void {
        const element = document.createElement('div');
        element.classList.add(COLLABORATION_INVITING_LINK_CLASS, 'theia-input');
        this.invitingLinkInput = document.createElement('input');
        this.invitingLinkInput.type = 'text';
        this.invitingLinkInput.className = 'theia-input';
        this.invitingLinkInput.setAttribute('style', 'flex: 0;');
        this.invitingLinkInput.disabled = true;
        this.copyInvitingLinkButton = this.createButton(IntlUtil.get('Copy link')!);
        this.copyInvitingLinkButton.classList.add(COLLABORATION_COPY_CLASS);
        element.append(this.invitingLinkInput);
        element.append(this.copyInvitingLinkButton);
        this.turnOnContainer.appendChild(element);
    }

    protected appendApprovalCheckBox(): void {
        const element = document.createElement('div');
        element.classList.add(COLLABORATION_APPROVAL_CHECK_BOX_CLASS);
        this.approvalCheckBox = document.createElement('input');
        this.approvalCheckBox.id = 'collaboration-dialog-approval-checkbox';
        this.approvalCheckBox.type = 'checkbox';
        this.approvalCheckBox.className = 'theia-input';
        this.approvalCheckBox.checked = false;
        const label: HTMLLabelElement = document.createElement('label');
        label.htmlFor = this.approvalCheckBox.id;
        label.appendChild(this.approvalCheckBox);
        const span = document.createElement('span');
        span.appendChild(document.createTextNode(IntlUtil.get('Approval confirmation when joining by link')!));
        label.appendChild(this.approvalCheckBox);
        label.appendChild(span);
        element.appendChild(label);
        this.resetToken = document.createElement('label');
        const icon = document.createElement('i');
        icon.classList.add('fa', 'fa-refresh');
        icon.style.marginRight = '0.5em';
        this.resetToken.appendChild(icon);
        this.resetToken.classList.add(COLLABORATION_RESET_PASSWORD_CLASS);
        this.resetToken.appendChild(document.createTextNode(IntlUtil.get('Reset link')!));
        element.appendChild(this.resetToken);
        this.turnOnContainer.appendChild(element);
    }

    protected appendTurnOnCollaborationButton(): HTMLButtonElement {
        this.turnOnCollaborationButton = this.createButton(IntlUtil.get('Turn on collaboration')!);
        this.turnOnCollaborationButton.classList.add(COLLABORATION_HIDDEN_CLASS);
        this.controlPanel.appendChild(this.turnOnCollaborationButton);
        return this.turnOnCollaborationButton;
    }

    protected appendTurnOffCollaborationButton(): HTMLButtonElement {
        this.turnOffCollaborationButton = this.createButton(IntlUtil.get('Turn off collaboration')!);
        this.turnOffCollaborationButton.classList.add('secondary');
        this.turnOffCollaborationButton.classList.add(COLLABORATION_HIDDEN_CLASS);
        this.controlPanel.appendChild(this.turnOffCollaborationButton);
        return this.turnOffCollaborationButton;
    }

    protected onAfterAttach(msg: Message): void {
        super.onAfterAttach(msg);
        this.addKeyListener(this.turnOnCollaborationButton, Key.ENTER, async () => {
            await this.loadCollaboration();
            if (!this.collaboration) {
                this.collaboration = await this.collaborationServer.create(FileUri.fsPath(this.props.fileStat.resource));
            }
            this.collaboration = await this.collaborationServer.turnOn(this.collaboration.id);
            this.refresh();
        }, 'click');

        this.addEventListener(this.turnOffCollaborationButton, 'click', async () => {
            this.collaboration = await this.collaborationServer.turnOff(this.collaboration!.id);
            this.refresh();
        });

        this.addEventListener(this.copyCollaborationLinkButton, 'click', async () => {
            await this.clipboardService.writeText(this.collaborationLinkInput.value);
            this.messageService.info(IntlUtil.get('Link copied to clipboard')!);
        });

        this.addEventListener(this.copyInvitingLinkButton, 'click', async () => {
            await this.clipboardService.writeText(this.invitingLinkInput.value);
            this.messageService.info(IntlUtil.get('Link copied to clipboard')!);
        });

        this.addEventListener(this.approvalCheckBox, 'change', async () => {
            this.collaboration = await this.collaborationServer.updateApproval(this.collaboration!.id, this.approvalCheckBox.checked);
            this.refresh();

        });

        this.addEventListener(this.resetToken, 'click', async () => {
            this.collaboration!.token = await this.collaborationServer.resetToken(this.collaboration!.id);
            this.refresh();
            this.messageService.info(IntlUtil.get('Reset link successfully')!);
        });

        this.addEventListener(this.editSlugIcon, 'click', async () => {
            const dialog = new SingleTextInputDialog({
                title: 'Slug',
                confirmButtonLabel: IntlUtil.get('OK'),
                initialValue: this.collaboration!.slug,
                initialSelectionRange: {
                    start: 0,
                    end: this.collaboration!.slug.length
                },
                validate: (input, mode) => {
                    if (!input) {
                        return IntlUtil.get('The slug cannot be empty.')!;
                    } else if (input.length <= 2) {
                        return IntlUtil.get('At least three characters.')!;
                    } else if (!/^[a-zA-Z0-9-_.]+$/.test(input)) {
                        return IntlUtil.get('Only letters, numbers, hyphen, underscore and dot are allowed.')!;
                    }
                    return '';
                }
            });
            const slug = (await dialog.open())!;
            this.collaboration = await this.collaborationServer.updateSlug(this.collaboration!.id, slug);
            this.refresh();
        });
    }

}
