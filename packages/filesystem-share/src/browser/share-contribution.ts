import {
    KeybindingRegistry,
    Widget,
    KeybindingContribution,
    WidgetManager
} from '@theia/core/lib/browser';
import {
    Command,
    CommandRegistry,
    MenuModelRegistry,
    CommandContribution,
    MenuContribution,
} from '@theia/core/lib/common';
import { FILE_NAVIGATOR_ID, FileNavigatorWidget } from '@theia/navigator/lib/browser/navigator-widget';
import { FileStatNode } from '@theia/filesystem/lib/browser';
import { NAVIGATOR_CONTEXT_MENU } from '@theia/navigator/lib/browser/navigator-contribution';
import { Component, Autowired } from '@malagu/core';
import { THEIA_EXT, VSCODE_EXT } from '@theia/workspace/lib/common';
import { FileStat } from '@theia/filesystem/lib/common/files';
import { LabelProvider } from '@theia/core/lib/browser';
import { ShareDialog } from './share-dialog';
import { ShareServer, ShareService } from '../common';
import { Autorpc } from '@malagu/rpc';
import { IntlUtil } from '@cellbang/desktop/lib/browser';
import { ClipboardService } from '@theia/core/lib/browser/clipboard-service';
import { MessageService } from '@theia/core';

export namespace ShareCommands {
    export const SHARE: Command = {
        id: 'share.share',
        label: 'Share...'
    };
}

export namespace ShareContenxtMenu {

    export const SHARE = [...NAVIGATOR_CONTEXT_MENU, '2_share'];
}

@Component([ShareContribution, CommandContribution, MenuContribution, KeybindingContribution])
export class ShareContribution implements CommandContribution, MenuContribution, KeybindingContribution {

    @Autowired(WidgetManager)
    protected readonly widgetManager: WidgetManager;

    @Autowired(LabelProvider)
    protected readonly labelProvider: LabelProvider;

    @Autowired(ShareService)
    protected readonly shareService: ShareService;

    @Autorpc(ShareServer)
    protected readonly shareServer: ShareServer;

    @Autowired(ClipboardService)
    protected readonly clipboardService: ClipboardService;

    @Autowired(MessageService)
    protected readonly messageService: MessageService;

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(ShareCommands.SHARE, {
            isEnabled: () => this.canShare(),
            isVisible: () => this.canShare(),
            execute: () => {
                this.getSelectedFileNodes().forEach(async node => {
                    const dialog = new ShareDialog({
                        title: IntlUtil.get('Link sharing')!,
                        fileStat: node.fileStat
                    }, this.labelProvider, this.shareServer, this.clipboardService, this.messageService);
                    dialog.open();
                });
            }
        });
    }

    protected tryGetWidget(): FileNavigatorWidget | undefined {
        return this.widgetManager.tryGetWidget(FILE_NAVIGATOR_ID);
    }

    protected getSelectedFileNodes(): FileStatNode[] {
        return this.tryGetWidget()?.model.selectedNodes.filter(FileStatNode.is) || [];
    }

    protected canShare(): boolean {
        const nodes = this.getSelectedFileNodes();
        if (nodes.length === 1) {
            const node = nodes[0];
            if (node.fileStat.isDirectory || this.isWorkspaceFile(node.fileStat)) {
                return true;
            }
        }
        return false;
    }

    protected isWorkspaceFile(fileStat: FileStat): boolean {
        return fileStat.resource.path.ext === `.${THEIA_EXT}` || fileStat.resource.path.ext === `.${VSCODE_EXT}`;
    }

    protected withWidget<T>(widget: Widget | undefined = this.tryGetWidget(), cb: (navigator: FileNavigatorWidget) => T): T | false {
        if (widget instanceof FileNavigatorWidget && widget.id === FILE_NAVIGATOR_ID) {
            return cb(widget);
        }
        return false;
    }

    registerMenus(registry: MenuModelRegistry): void {

        registry.registerMenuAction(ShareContenxtMenu.SHARE, {
            commandId: ShareCommands.SHARE.id
        });

    }

    registerKeybindings(registry: KeybindingRegistry): void {

    }

}
