import { FileNavigatorContribution, FileNavigatorCommands, NavigatorMoreToolbarGroups } from '@theia/navigator/lib/browser/navigator-contribution';
import { FileDownloadCommands } from '@theia/filesystem/lib/browser/download/file-download-command-contribution';
import { MenuModelRegistry } from '@theia/core';
import { TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { WorkspaceCommands } from '@theia/workspace/lib/browser';
import { FrontendApplication } from '@theia/core/lib/browser';

import { Component } from '@malagu/core';

@Component({ id: FileNavigatorContribution, rebind: true })
export class FileNavigatorContributionExt extends FileNavigatorContribution {

    registerMenus(registry: MenuModelRegistry): void {
        super.registerMenus(registry);
        registry.unregisterMenuAction(FileDownloadCommands.COPY_DOWNLOAD_LINK.id);
    }

    async initializeLayout(app: FrontendApplication): Promise<void> {
        await this.openView({
            toggle: false,
            reveal: true
        });
        this.shell.expandPanel('left');
    }

    async registerToolbarItems(toolbarRegistry: TabBarToolbarRegistry): Promise<void> {
        toolbarRegistry.registerItem({
            id: FileNavigatorCommands.COLLAPSE_ALL.id,
            command: FileNavigatorCommands.COLLAPSE_ALL.id,
            tooltip: 'Collapse All',
            priority: 1,
        });
        this.registerMoreToolbarItem({
            id: WorkspaceCommands.NEW_FILE.id,
            command: WorkspaceCommands.NEW_FILE.id,
            tooltip: WorkspaceCommands.NEW_FILE.label,
            group: NavigatorMoreToolbarGroups.NEW_OPEN,
        });
        this.registerMoreToolbarItem({
            id: WorkspaceCommands.NEW_FOLDER.id,
            command: WorkspaceCommands.NEW_FOLDER.id,
            tooltip: WorkspaceCommands.NEW_FOLDER.label,
            group: NavigatorMoreToolbarGroups.NEW_OPEN,
        });
        this.registerMoreToolbarItem({
            id: FileNavigatorCommands.TOGGLE_AUTO_REVEAL.id,
            command: FileNavigatorCommands.TOGGLE_AUTO_REVEAL.id,
            tooltip: FileNavigatorCommands.TOGGLE_AUTO_REVEAL.label,
            group: NavigatorMoreToolbarGroups.TOOLS,
        });
    }

}
