import {
    KeybindingRegistry,
    Widget,
    KeybindingContribution,
    WidgetManager,
    OpenerService,
    open
} from '@theia/core/lib/browser';
import {
    Command,
    CommandRegistry,
    MenuModelRegistry,
    CommandContribution,
    MenuContribution,
    MenuPath
} from '@theia/core/lib/common';
import { FILE_NAVIGATOR_ID, FileNavigatorWidget } from '@theia/navigator/lib/browser/navigator-widget';
import { FileStatNode } from '@theia/filesystem/lib/browser';
import { NAVIGATOR_CONTEXT_MENU } from '@theia/navigator/lib/browser/navigator-contribution';
import { Component, Autowired } from '@malagu/core';
import { FileUri } from '@theia/core/lib/node/file-uri';
import { LabelProvider } from '@theia/core/lib/browser';
import { CollaborationDialog } from './collaboration-dialog';
import { CollaborationServer, isWorkspaceFile, MemberService } from '../common';
import { Autorpc } from '@malagu/rpc';
import { IntlUtil } from '@cellbang/desktop/lib/browser';
import { ClipboardService } from '@theia/core/lib/browser/clipboard-service';
import { MessageService } from '@theia/core';
import { MembersWidget } from './members-widget';
import { TabBarToolbarContribution, TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';

export namespace MemberCommands {
    export const COLLABORATIONS: Command = {
        id: 'member.collaborations',
        label: 'Collaborations...'
    };

    export const ADD_MEMBER: Command = {
        id: 'member.add.member',
        label: 'Add Member',
        iconClass: 'fa fa-user-plus'
    };

    export const MEMBERS: Command = {
        id: 'member.members',
        label: 'Members...'
    };

    export const SETTINGS: Command = {
        id: 'member.settings',
        label: 'Settings...'
    };
}

export namespace MemberContenxtMenu {

    export const MEMBER = [...NAVIGATOR_CONTEXT_MENU, '2_member'];
}

export const MEMBER_ROLE_MENU: MenuPath = ['member_role_menu'];

@Component([MemberContribution, CommandContribution, MenuContribution, KeybindingContribution, TabBarToolbarContribution])
export class MemberContribution implements CommandContribution, MenuContribution, KeybindingContribution {

    @Autowired(WidgetManager)
    protected readonly widgetManager: WidgetManager;

    @Autowired(OpenerService)
    protected readonly openerService: OpenerService;

    @Autowired(MemberService)
    protected readonly memberService: MemberService;

    @Autowired(LabelProvider)
    protected readonly labelProvider: LabelProvider;

    @Autorpc(CollaborationServer)
    protected readonly collaborationServer: CollaborationServer;

    @Autowired(ClipboardService)
    protected readonly clipboardService: ClipboardService;

    @Autowired(MessageService)
    protected readonly messageService: MessageService;

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(MemberCommands.COLLABORATIONS, {
            isEnabled: () => this.canCollaborations(),
            isVisible: () => this.canCollaborations(),
            execute: () => {
                this.getSelectedFileNodes().forEach(async node => {
                    this.openCollaborationDialog(node);
                });
            }
        });

        registry.registerCommand(MemberCommands.MEMBERS, {
            isEnabled: () => this.canCollaborations(),
            isVisible: () => this.canCollaborations(),
            execute: () => {
                this.getSelectedFileNodes().forEach(async node => {
                    await open(this.openerService, node.fileStat.resource.withScheme('members'));
                });
            }
        });

        registry.registerCommand(MemberCommands.ADD_MEMBER, {
            isEnabled: widget => widget instanceof MembersWidget,
            isVisible: widget => widget instanceof MembersWidget,
            execute: (widget: MembersWidget) => {
                const nodes = this.tryGetWidget()?.model.getNodesByUri(widget.uri);
                if (nodes) {
                    for (const node of nodes) {
                        this.openCollaborationDialog(node as FileStatNode);
                    }
                }
            }
        });

        registry.registerCommand(MemberCommands.SETTINGS, {
            isEnabled: () => this.canCollaborations(),
            isVisible: () => this.canCollaborations(),
            execute: () => {
                this.getSelectedFileNodes().forEach(async node => {
                    const dialog = new CollaborationDialog({
                        title: node.fileStat.isDirectory ? IntlUtil.get('Directory collaboration')! : IntlUtil.get('Workspace collaboration')!,
                        fileStat: node.fileStat
                    }, this.labelProvider, this.collaborationServer, this.clipboardService, this.messageService);
                    dialog.open();
                });
            }
        });
    }

    protected openCollaborationDialog(node: FileStatNode) {
        const dialog = new CollaborationDialog({
            title: node.fileStat.isDirectory ? IntlUtil.get('Directory collaboration')! : IntlUtil.get('Workspace collaboration')!,
            fileStat: node.fileStat
        }, this.labelProvider, this.collaborationServer, this.clipboardService, this.messageService);
        dialog.open();
    }

    protected tryGetWidget(): FileNavigatorWidget | undefined {
        return this.widgetManager.tryGetWidget(FILE_NAVIGATOR_ID);
    }

    protected getSelectedFileNodes(): FileStatNode[] {
        return this.tryGetWidget()?.model.selectedNodes.filter(FileStatNode.is) || [];
    }

    protected canCollaborations(): boolean {
        const nodes = this.getSelectedFileNodes();
        if (nodes.length === 1) {
            const node = nodes[0];
            if (node.fileStat.isDirectory || isWorkspaceFile(FileUri.fsPath(node.fileStat.resource))) {
                return true;
            }
        }
        return false;
    }

    protected withWidget<T>(widget: Widget | undefined = this.tryGetWidget(), cb: (navigator: FileNavigatorWidget) => T): T | false {
        if (widget instanceof FileNavigatorWidget && widget.id === FILE_NAVIGATOR_ID) {
            return cb(widget);
        }
        return false;
    }

    registerMenus(registry: MenuModelRegistry): void {

        registry.registerMenuAction(MemberContenxtMenu.MEMBER, {
            commandId: MemberCommands.COLLABORATIONS.id
        });

        registry.registerMenuAction(MemberContenxtMenu.MEMBER, {
            commandId: MemberCommands.MEMBERS.id
        });

        registry.registerMenuAction(MemberContenxtMenu.MEMBER, {
            commandId: MemberCommands.SETTINGS.id
        });

    }

    registerKeybindings(registry: KeybindingRegistry): void {

    }

    registerToolbarItems(toolbar: TabBarToolbarRegistry): void {
        toolbar.registerItem({
            id: MemberCommands.ADD_MEMBER.id,
            command: MemberCommands.ADD_MEMBER.id,
            tooltip: 'Add Member'
        });
    }

}
