
import { PreferenceTreeModel } from '@theia/preferences/lib/browser/preference-tree-model';
import { PostConstruct } from '@malagu/core';

export class PreferenceTreeModelExt extends PreferenceTreeModel {

    @PostConstruct()
    protected init(): void {
        super.init();
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
