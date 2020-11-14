
import { CommonCommands, CommonFrontendContribution, CommonMenus, KeybindingRegistry, SHELL_TABBAR_CONTEXT_MENU } from '@theia/core/lib/browser';
import { isWindows } from '@malagu/core';
import { MenuModelRegistry, environment } from '@theia/core';
import { Condition } from '../../common/utils';
import { injectable } from 'inversify';

@injectable()
export class DesktopCommonFrontendContribution extends CommonFrontendContribution {

    registerMenus(registry: MenuModelRegistry): void {
        if (Condition.isEditorMode()) {
            super.registerMenus(registry);
            return;
        }
        registry.registerSubmenu(CommonMenus.VIEW, 'View');
        registry.registerSubmenu(CommonMenus.HELP, 'Help');

        registry.registerMenuAction(CommonMenus.VIEW_LAYOUT, {
            commandId: CommonCommands.TOGGLE_BOTTOM_PANEL.id,
            order: '0'
        });
        registry.registerMenuAction(CommonMenus.VIEW_LAYOUT, {
            commandId: CommonCommands.COLLAPSE_ALL_PANELS.id,
            order: '1'
        });

        registry.registerMenuAction(SHELL_TABBAR_CONTEXT_MENU, {
            commandId: CommonCommands.CLOSE_TAB.id,
            label: 'Close',
            order: '0'
        });
        registry.registerMenuAction(SHELL_TABBAR_CONTEXT_MENU, {
            commandId: CommonCommands.CLOSE_OTHER_TABS.id,
            label: 'Close Others',
            order: '1'
        });
        registry.registerMenuAction(SHELL_TABBAR_CONTEXT_MENU, {
            commandId: CommonCommands.CLOSE_RIGHT_TABS.id,
            label: 'Close to the Right',
            order: '2'
        });
        registry.registerMenuAction(SHELL_TABBAR_CONTEXT_MENU, {
            commandId: CommonCommands.CLOSE_ALL_TABS.id,
            label: 'Close All',
            order: '3'
        });
        registry.registerMenuAction(SHELL_TABBAR_CONTEXT_MENU, {
            commandId: CommonCommands.COLLAPSE_PANEL.id,
            label: 'Collapse',
            order: '4'
        });
        registry.registerMenuAction(SHELL_TABBAR_CONTEXT_MENU, {
            commandId: CommonCommands.TOGGLE_MAXIMIZED.id,
            label: 'Toggle Maximized',
            order: '5'
        });
        registry.registerMenuAction(CommonMenus.HELP, {
            commandId: CommonCommands.ABOUT_COMMAND.id,
            label: 'About',
            order: '9'
        });
    }

    registerKeybindings(registry: KeybindingRegistry): void {
        registry.registerKeybindings(
            // Tabs
            {
                command: CommonCommands.NEXT_TAB.id,
                keybinding: 'ctrlcmd+tab'
            },
            {
                command: CommonCommands.NEXT_TAB.id,
                keybinding: 'ctrlcmd+alt+d'
            },
            {
                command: CommonCommands.PREVIOUS_TAB.id,
                keybinding: 'ctrlcmd+shift+tab'
            },
            {
                command: CommonCommands.PREVIOUS_TAB.id,
                keybinding: 'ctrlcmd+alt+a'
            },
            {
                command: CommonCommands.CLOSE_MAIN_TAB.id,
                keybinding: this.isEl() ? (isWindows ? 'ctrl+f4' : 'ctrlcmd+w') : 'alt+w'
            },
            {
                command: CommonCommands.CLOSE_OTHER_MAIN_TABS.id,
                keybinding: 'ctrlcmd+alt+t'
            },
            {
                command: CommonCommands.CLOSE_ALL_MAIN_TABS.id,
                keybinding: this.isEl() ? 'ctrlCmd+k ctrlCmd+w' : 'alt+shift+w'
            },
            // Panels
            {
                command: CommonCommands.COLLAPSE_PANEL.id,
                keybinding: 'alt+c'
            },
            {
                command: CommonCommands.TOGGLE_BOTTOM_PANEL.id,
                keybinding: 'ctrlcmd+j',
            },
            {
                command: CommonCommands.COLLAPSE_ALL_PANELS.id,
                keybinding: 'alt+shift+c',
            },
            {
                command: CommonCommands.TOGGLE_MAXIMIZED.id,
                keybinding: 'alt+m',
            }
        );
    }

    protected isEl(): boolean {
        return environment.electron.is();
    }
}
