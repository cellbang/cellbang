
import { autoBind } from '@malagu/core';
import { createTreeContainer, TreeWidget, TreeProps, defaultTreeProps, TreeModel } from '@theia/core/lib/browser';
import { PreferencesEditorWidget } from '@theia/preferences/lib/browser/views/preference-editor-widget';
import { PreferencesTreeWidget } from '@theia/preferences/lib/browser/views/preference-tree-widget';
import { PreferencesWidget } from '@theia/preferences/lib/browser/views/preference-widget';
import { PreferenceSelectInputRenderer } from '@theia/preferences/lib/browser/views/components/preference-select-input';
import { PreferenceArrayInputRenderer } from '@theia/preferences/lib/browser/views/components/preference-array-input';
import { PreferenceBooleanInputRenderer } from '@theia/preferences/lib/browser/views/components/preference-boolean-input';
import { PreferenceJSONLinkRenderer } from '@theia/preferences/lib/browser/views/components/preference-json-input';
import { PreferenceNumberInputRenderer } from '@theia/preferences/lib/browser/views/components/preference-number-input';
import { PreferenceStringInputRenderer } from '@theia/preferences/lib/browser/views/components/preference-string-input';
import { PreferenceHeaderRenderer } from '@theia/preferences/lib/browser/views/components/preference-node-renderer';
import { PreferencesSearchbarWidget } from '@theia/preferences/lib/browser/views/preference-searchbar-widget';
import { PreferencesScopeTabBar } from '@theia/preferences/lib/browser/views/preference-scope-tabbar-widget';
import { interfaces, Container } from 'inversify';
import { PreferenceTreeModelExt } from './preference-tree-model';
import { PreferenceNodeRendererFactory } from '@theia/preferences/lib/browser/views/components/preference-node-renderer';
import { Preference } from '@theia/preferences/lib/browser/util/preference-types';
import { PreferenceTreeModel } from '@theia/preferences/lib/browser/preference-tree-model';

export default autoBind((bind, unbind, isBound, rebind) => {
    rebind(PreferencesWidget)
        .toDynamicValue(({ container }) => createPreferencesWidgetContainer(container).get(PreferencesWidget)).inSingletonScope();
});

function createPreferencesWidgetContainer(parent: interfaces.Container): Container {
    const child = createTreeContainer(parent);
    child.bind(PreferenceTreeModel).to(PreferenceTreeModelExt);
    child.rebind(TreeModel).toService(PreferenceTreeModel);
    child.unbind(TreeWidget);
    child.bind(PreferencesTreeWidget).toSelf();
    child.rebind(TreeProps).toConstantValue({ ...defaultTreeProps, search: false });
    child.bind(PreferencesEditorWidget).toSelf();

    child.bind(PreferencesSearchbarWidget).toSelf();
    child.bind(PreferencesScopeTabBar).toSelf();
    child.bind(PreferencesWidget).toSelf();

    child.bind(PreferenceNodeRendererFactory).toFactory(({ container }) => (node: Preference.TreeNode) => {
        const grandchild = container.createChild();
        grandchild.bind(Preference.Node).toConstantValue(node);
        if (Preference.LeafNode.is(node)) {
            if (node.preference.data.enum) {
                return grandchild.get(PreferenceSelectInputRenderer);
            }
            const type = Array.isArray(node.preference.data.type) ? node.preference.data.type[0] : node.preference.data.type;
            if (type === 'array' && node.preference.data.items?.type === 'string') {
                return grandchild.get(PreferenceArrayInputRenderer);
            }
            switch (type) {
                case 'string':
                    return grandchild.get(PreferenceStringInputRenderer);
                case 'boolean':
                    return grandchild.get(PreferenceBooleanInputRenderer);
                case 'number':
                case 'integer':
                    return grandchild.get(PreferenceNumberInputRenderer);
                default:
                    return grandchild.get(PreferenceJSONLinkRenderer);
            }
        } else {
            return grandchild.get(PreferenceHeaderRenderer);
        }
    });

    return child;
}
