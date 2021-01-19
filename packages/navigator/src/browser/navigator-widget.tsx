
import * as React from 'react';
import { injectable } from 'inversify';
import { Message } from '@phosphor/messaging';
import { ViewContainer, TreeModel } from '@theia/core/lib/browser';
import { FileNavigatorWidget, LABEL, EXPLORER_VIEW_CONTAINER_TITLE_OPTIONS } from '@theia/navigator/lib/browser/navigator-widget';
import { IntlUtil } from '@cellbang/desktop/src/browser/utils';

@injectable()
export class FileNavigatorWidgetExt extends FileNavigatorWidget {

    protected doUpdateRows(): void {
        super.doUpdateRows();
        if (this.title.label === LABEL) {
            this.title.label = IntlUtil.get(LABEL)!;
            this.title.caption = this.title.label;

        }
    }

    protected onUpdateRequest(msg: Message): void {
        if (this.parent?.parent?.parent) {
            const id = EXPLORER_VIEW_CONTAINER_TITLE_OPTIONS.label;
            (this.parent.parent.parent as ViewContainer).setTitleOptions({
                ...EXPLORER_VIEW_CONTAINER_TITLE_OPTIONS,
                label: IntlUtil.get(id)!
            });
        }
        super.onUpdateRequest(msg);
    }

    protected renderTree(model: TreeModel): React.ReactNode {
        if (!this.model.root) {
            return this.renderOpenWorkspaceDiv();
        }
        return super.renderTree(model);
    }

    /**
     * Instead of rendering the file resources from the workspace, we render a placeholder
     * button when the workspace root is not yet set.
     */
    protected renderOpenWorkspaceDiv(): React.ReactNode {
        let openButton;

        if (this.canOpenWorkspaceFileAndFolder) {
            openButton = <button className='theia-button open-workspace-button' title='Select a folder or a workspace-file to open as your workspace'
                onClick={this.openWorkspace} onKeyUp={this.keyUpHandler}>
                {IntlUtil.get('Open Workspace')}
            </button>;
        } else {
            openButton = <button className='theia-button open-workspace-button' title='Select a folder as your workspace root' onClick={this.openFolder}
                onKeyUp={this.keyUpHandler}>
                {IntlUtil.get('Open Folder')}
            </button>;
        }

        return <div className='theia-navigator-container'>
            <div className='center'>{IntlUtil.get('You have not yet opened a workspace.')}</div>
            <div className='open-workspace-button-container'>
                {openButton}
            </div>
        </div>;
    }

}
