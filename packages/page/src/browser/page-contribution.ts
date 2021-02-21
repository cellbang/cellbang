import {
    Command,
    CommandRegistry,
    CommandContribution
} from '@theia/core/lib/common';
import { TabBarToolbarContribution, TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { Component, Autowired } from '@malagu/core';
import { PageManager } from './page-manager';
import { PageWidget } from './page-widget';

export namespace PageCommands {
    export const RELOAD_PAGE: Command = {
        id: 'page.reloadPage',
        label: 'Reload This Page',
        iconClass: 'cellbang-page-refresh'
    };
}

@Component([PageContribution, CommandContribution, TabBarToolbarContribution])
export class PageContribution implements CommandContribution, TabBarToolbarContribution {

    @Autowired(PageManager)
    protected readonly pageManager: PageManager;

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(PageCommands.RELOAD_PAGE, {
            isEnabled: widget => widget instanceof PageWidget,
            isVisible: widget => widget instanceof PageWidget,
            execute: () => this.refreshPage()
        });
    }

    protected refreshPage() {
        this.pageManager.currentPage!.handleRefresh();
    }

    registerToolbarItems(toolbar: TabBarToolbarRegistry): void {
        toolbar.registerItem({
            id: PageCommands.RELOAD_PAGE.id,
            command: PageCommands.RELOAD_PAGE.id,
            tooltip: 'Reload This Page'
        });
    }

}
