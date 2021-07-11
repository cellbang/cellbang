
import { PreferenceTreeModel } from '@theia/preferences/lib/browser/preference-tree-model';
import { PostConstruct } from '@malagu/core';

export class PreferenceTreeModelExt extends PreferenceTreeModel {

    @PostConstruct()
    protected async init(): Promise<void> {
        await super.init();
        this.updateRows();
    }

    protected updateRows(): void {
        if (!this.root) {
            this.treeGenerator.handleChangedSchema();
        } else {
            super.updateRows();
        }
    }
}
