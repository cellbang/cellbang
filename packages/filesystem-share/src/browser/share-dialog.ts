import { Message } from '@phosphor/messaging';
import { Key } from '@theia/core/lib/browser/keyboard/keys';
import { LabelProvider } from '@theia/core/lib/browser';
import { AbstractDialog, DialogProps } from '@theia/core/lib/browser/dialogs';
import { Autowired } from '@malagu/core';
import { FileStat } from '@theia/filesystem/lib/common/files';
import { IntlUtil } from '@cellbang/desktop/lib/browser';
import { Share, ShareServer } from '../common';
import { FileUri } from '@theia/core/lib/node/file-uri';
import { ClipboardService } from '@theia/core/lib/browser/clipboard-service';
import { MessageService } from '@theia/core';

export const SHARE_MESSAGE_CLASS = 'cellbang-ShareMessage';
export const SHARE_SHARING_LINK_CLASS = 'cellbang-ShareSharingLink';
export const SHARE_PASSWORD_CHECK_BOX_CLASS = 'cellbang-SharePasswordCheckBox';
export const SHARE_PASSWORD_AREA_CLASS = 'cellbang-SharePasswordArea';
export const SHARE_RESET_PASSWORD_CLASS = 'cellbang-ShareResetPassword';
export const SHARE_COPY_CLASS = 'cellbang-ShareCopy';
export const SHARE_WORKSPACE_PATH_CLASS = 'cellbang-ShareWorkspacePath';
export const SHARE_HIDDEN_CLASS = 'cellbang-ShareHidden';

export class ShareDialogProps extends DialogProps {
    readonly title: string;
    readonly fileStat: FileStat;
}

export class ShareDialog extends AbstractDialog<void> {
    readonly value: void;

    protected turnOnContainer: HTMLDivElement;
    protected turnOffContainer: HTMLDivElement;

    protected turnOnSharingButton: HTMLButtonElement;
    protected turnOffSharingButton: HTMLButtonElement;
    protected copyButton: HTMLButtonElement;
    protected sharingLinkInput: HTMLInputElement;
    protected passwordCheckBox: HTMLInputElement;
    protected passwordLabel: HTMLLabelElement;
    protected resetPassword: HTMLLabelElement;
    protected passwordArea: HTMLDivElement;

    protected share: Share | undefined;

    constructor(
        protected readonly props: ShareDialogProps,
        @Autowired(LabelProvider) protected readonly labelProvider: LabelProvider,
        @Autowired(ShareServer) protected readonly shareServer: ShareServer,
        @Autowired(ClipboardService) protected readonly clipboardService: ClipboardService,
        @Autowired(MessageService) protected readonly messageService: MessageService
    ) {
        super({
            title: props.title,

        });
        this.appendWorkspacePath();
        this.appendTurnOffContainer();
        this.appendTurnOnContainer();
        this.loadShare();
    }

    protected hideElement(element: HTMLElement) {
        element.classList.add(SHARE_HIDDEN_CLASS);
    }

    protected showElement(element: HTMLElement) {
        element.classList.remove(SHARE_HIDDEN_CLASS);
    }

    protected refresh() {
        if (this.share && this.share.disabled === false ) {
            this.hideElement(this.turnOffContainer);
            this.hideElement(this.turnOnSharingButton);
            this.showElement(this.turnOnContainer);
            this.showElement(this.turnOffSharingButton);
            this.sharingLinkInput.value = `${location.protocol}//${location.host}${location.pathname}?share=${this.share.shareId}#${FileUri.fsPath(this.props.fileStat.resource)}`;
            if (this.share.password) {
                this.passwordCheckBox.checked = true;
                this.passwordLabel.textContent = `${IntlUtil.get('Password: ')}${this.share.password}`;
                this.copyButton.textContent = IntlUtil.get('Copy link and password')!;
                this.showElement(this.passwordArea);
            } else {
                this.passwordCheckBox.checked = false;
                this.hideElement(this.passwordArea);
            }
        } else {
            this.hideElement(this.turnOnContainer);
            this.hideElement(this.turnOffSharingButton);
            this.showElement(this.turnOffContainer);
            this.showElement(this.turnOnSharingButton);
        }
    }

    async loadShare() {
        this.share = await this.shareServer.getByResource(FileUri.fsPath(this.props.fileStat.resource));
        this.refresh();
    }

    protected appendTurnOffContainer(): void {
        this.turnOffContainer = document.createElement('div');
        this.turnOffContainer.classList.add(SHARE_HIDDEN_CLASS);
        this.contentNode.appendChild(this.turnOffContainer);
        this.appendMessageAfterTurningOn();
        this.appendTurnOnSharingButton();

    }

    protected appendTurnOnContainer(): void {
        this.turnOnContainer = document.createElement('div');
        this.turnOnContainer.classList.add(SHARE_HIDDEN_CLASS);
        this.contentNode.appendChild(this.turnOnContainer);
        this.appendMessageAfterTurningOff();
        this.appendSharingLink();
        this.appendPasswordCheckBox();
        this.appendPasswordArea();
        this.appendTurnOffSharingButton();
    }

    protected appendWorkspacePath(): void {
        const stat = this.props.fileStat;
        const label = this.labelProvider.getLongName(stat.resource);
        const element = document.createElement('div');
        element.classList.add(SHARE_WORKSPACE_PATH_CLASS);
        const icon = document.createElement('i');
        icon.classList.add('fa', stat.isDirectory ? 'fa-folder' : 'fa-file');
        element.appendChild(icon);
        element.appendChild(document.createTextNode(label));
        this.contentNode.appendChild(element);
    }

    protected appendMessageAfterTurningOn(): void {
        const element = document.createElement('div');
        element.classList.add(SHARE_MESSAGE_CLASS);
        element.appendChild(document.createTextNode(IntlUtil.get('Turn on to share knowledges with others via a link')!));
        this.turnOffContainer.appendChild(element);
    }

    protected appendMessageAfterTurningOff(): void {
        const element = document.createElement('div');
        element.classList.add(SHARE_MESSAGE_CLASS);
        element.appendChild(document.createTextNode(IntlUtil.get('Everyone who gets the link can access this Document')!));
        this.turnOnContainer.appendChild(element);
    }

    protected appendSharingLink(): void {
        const element = document.createElement('div');
        element.classList.add(SHARE_SHARING_LINK_CLASS, 'theia-input');
        this.sharingLinkInput = document.createElement('input');
        this.sharingLinkInput.type = 'text';
        this.sharingLinkInput.className = 'theia-input';
        this.sharingLinkInput.setAttribute('style', 'flex: 0;');
        this.sharingLinkInput.disabled = true;
        this.copyButton = this.createButton(IntlUtil.get('Copy link')!);
        this.copyButton.classList.add(SHARE_COPY_CLASS);
        element.append(this.sharingLinkInput);
        element.append(this.copyButton);
        this.turnOnContainer.appendChild(element);
    }

    protected appendPasswordCheckBox(): void {
        const element = document.createElement('div');
        element.classList.add(SHARE_PASSWORD_CHECK_BOX_CLASS);
        this.passwordCheckBox = document.createElement('input');
        this.passwordCheckBox.id = 'shara-dialog-password-checkbox';
        this.passwordCheckBox.type = 'checkbox';
        this.passwordCheckBox.className = 'theia-input';
        this.passwordCheckBox.checked = false;
        const label: HTMLLabelElement = document.createElement('label');
        label.htmlFor = this.passwordCheckBox.id;
        label.appendChild(this.passwordCheckBox);
        const span = document.createElement('span');
        span.appendChild(document.createTextNode(IntlUtil.get('Password required to access')!));
        label.appendChild(this.passwordCheckBox);
        label.appendChild(span);
        element.appendChild(label);
        this.turnOnContainer.appendChild(element);
    }

    protected appendPasswordArea(): void {
        this.passwordArea = document.createElement('div');
        this.passwordArea.classList.add(SHARE_PASSWORD_AREA_CLASS, 'theia-input');
        this.passwordLabel = document.createElement('label');
        const icon = document.createElement('i');
        icon.classList.add('fa', 'fa-refresh');
        icon.style.marginRight = '0.5em';
        this.resetPassword = document.createElement('label');
        this.resetPassword.appendChild(icon);
        this.resetPassword.classList.add(SHARE_RESET_PASSWORD_CLASS);
        this.resetPassword.appendChild(document.createTextNode(IntlUtil.get('Reset Password')!));
        this.passwordArea.append(this.passwordLabel);
        this.passwordArea.appendChild(this.resetPassword);
        this.turnOnContainer.appendChild(this.passwordArea);
    }

    protected appendTurnOnSharingButton(): HTMLButtonElement {
        this.turnOnSharingButton = this.createButton(IntlUtil.get('Turn on sharing')!);
        this.turnOnSharingButton.classList.add(SHARE_HIDDEN_CLASS);
        this.controlPanel.appendChild(this.turnOnSharingButton);
        return this.turnOnSharingButton;
    }

    protected appendTurnOffSharingButton(): HTMLButtonElement {
        this.turnOffSharingButton = this.createButton(IntlUtil.get('Turn off sharing')!);
        this.turnOffSharingButton.classList.add('secondary');
        this.turnOffSharingButton.classList.add(SHARE_HIDDEN_CLASS);
        this.controlPanel.appendChild(this.turnOffSharingButton);
        return this.turnOffSharingButton;
    }

    protected onAfterAttach(msg: Message): void {
        super.onAfterAttach(msg);
        this.addKeyListener(this.turnOnSharingButton, Key.ENTER, async () => {
            this.share = await this.shareServer.turnOn(FileUri.fsPath(this.props.fileStat.resource));
            this.refresh();
            // this.accept();
        }, 'click');

        this.addEventListener(this.turnOffSharingButton, 'click', async () => {
            this.share = await this.shareServer.turnOff(FileUri.fsPath(this.props.fileStat.resource));
            this.refresh();
        });

        this.addEventListener(this.copyButton, 'click', async () => {
            await this.clipboardService.writeText(this.sharingLinkInput.value
                + (this.share?.password ? `[${this.passwordLabel.textContent}]` : ''));
            this.messageService.info(IntlUtil.get('Link copied to clipboard')!);
        });

        this.addEventListener(this.passwordCheckBox, 'change', async () => {
            const resource = FileUri.fsPath(this.props.fileStat.resource);
            if (this.passwordCheckBox.checked) {
                this.share!.password = await this.shareServer.resetPassword(resource);
            } else {
                await this.shareServer.clearPassword(resource);
                this.share!.password = undefined;
            }
            this.refresh();

        });
        this.addEventListener(this.resetPassword, 'click', async () => {
            this.share!.password = await this.shareServer.resetPassword(FileUri.fsPath(this.props.fileStat.resource));
            this.refresh();
        });
    }

}
