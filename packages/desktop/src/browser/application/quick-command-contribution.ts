import { CommandRegistry, MenuModelRegistry } from '@theia/core';
import { KeybindingRegistry, QuickCommandFrontendContribution } from '@theia/core/lib/browser';
import { injectable } from 'inversify';

@injectable()
export class DesktopQuickCommandContribution extends QuickCommandFrontendContribution {

    registerCommands(commands: CommandRegistry): void {
    }

    registerMenus(menus: MenuModelRegistry): void {
    }

    registerKeybindings(keybindings: KeybindingRegistry): void {
    }
}
