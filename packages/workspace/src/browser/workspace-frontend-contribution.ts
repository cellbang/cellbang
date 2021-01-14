import { CommandRegistry, MenuModelRegistry } from '@theia/core/lib/common';
import { CommonMenus, KeybindingRegistry } from '@theia/core/lib/browser';
import { WorkspaceCommands, WorkspaceFrontendContribution } from '@theia/workspace/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { UriAwareCommandHandler } from '@theia/core/lib/common/uri-command-handler';
import { Component } from '@malagu/core';

@Component({ id: WorkspaceFrontendContribution, rebind: true })
export class WorkspaceFrontendContributionExt extends WorkspaceFrontendContribution {

    registerCommands(commands: CommandRegistry): void {

        commands.registerCommand(WorkspaceCommands.SAVE_AS,
            new UriAwareCommandHandler(this.selectionService, {
                execute: (uri: URI) => this.saveAs(uri),
            }));
    }

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.FILE_SAVE, {
            commandId: WorkspaceCommands.SAVE_AS.id,
        });
    }

    registerKeybindings(keybindings: KeybindingRegistry): void {
        keybindings.registerKeybinding({
            command: WorkspaceCommands.SAVE_AS.id,
            keybinding: 'ctrl+shift+s',
        });
    }
}
