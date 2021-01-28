import { Component, Autowired } from '@malagu/core';
import { SingleTextInputDialog, SingleTextInputDialogProps } from '@theia/core/lib/browser';
import { IntlUtil } from '@cellbang/desktop/lib/browser';
import { ShareService } from '../common';
import { interfaces } from 'inversify';

export const SHARE_PASSWORD_DIALOG_CLASS = 'cellbang-SharePasswordDialog';

const validatePassword = async (password: string, ctx: interfaces.Context) => {
    if (!password) {
        return IntlUtil.get('Enter your password');
    }
    const shareService = ctx.container.get<ShareService>(ShareService);
    try {
        await shareService.checkShareStatus(password);
        return '';
    } catch (error) {
        return IntlUtil.get(error?.response?.data);
    }
};

@Component({ onActivation: ctx => <SharePasswordDialogProps>{
        title: IntlUtil.get('Enter password'),
        confirmButtonLabel: IntlUtil.get('OK'),
        validate: (password, mode) => mode === 'open' ? validatePassword(password, ctx) : ''
    } })
export class SharePasswordDialogProps extends SingleTextInputDialogProps {

}

@Component(SharePasswordDialog)
export class SharePasswordDialog extends SingleTextInputDialog {

    constructor(
        @Autowired(SharePasswordDialogProps) protected readonly props: SharePasswordDialogProps
    ) {
        super(props);
        this.appendMessage();
        this.addClass(SHARE_PASSWORD_DIALOG_CLASS);
        const container = document.createElement('div');
        container.classList.add('theia-input');
        container.appendChild(this.inputField);
        container.appendChild(this.acceptButton!);
        this.contentNode.appendChild(container);
    }

    protected appendMessage(): void {
        const element = document.createElement('div');
        element.appendChild(document.createTextNode(IntlUtil.get('Please enter the password to access current Document')!));
        this.contentNode.insertBefore(element, this.inputField);
    }

}
