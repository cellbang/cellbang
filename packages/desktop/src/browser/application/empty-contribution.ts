import { Component } from '@malagu/core';
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry } from '@theia/core';
import { KeybindingContribution, KeybindingRegistry, QuickCommandFrontendContribution } from '@theia/core/lib/browser';

@Component({ id: QuickCommandFrontendContribution, rebind: true })
export class EmptyContribution implements CommandContribution, KeybindingContribution, MenuContribution {

    registerCommands(commands: CommandRegistry): void {
    }

    registerMenus(menus: MenuModelRegistry): void {
    }

    registerKeybindings(keybindings: KeybindingRegistry): void {
    }
}
