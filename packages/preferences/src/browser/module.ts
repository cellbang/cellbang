
import { autoBind } from '@malagu/core';
import { createTreeContainer, TreeWidget, TreeProps, defaultTreeProps, TreeDecoratorService, TreeModel } from '@theia/core/lib/browser';
import { PreferenceTreeModel } from '@theia/preferences/lib/browser/preference-tree-model';
import { PreferencesEditorWidget } from '@theia/preferences/lib/browser/views/preference-editor-widget';
import { PreferencesTreeWidget } from '@theia/preferences/lib/browser/views/preference-tree-widget';
import { PreferencesWidget } from '@theia/preferences/lib/browser/views/preference-widget';
import { SinglePreferenceDisplayFactory } from '@theia/preferences/lib/browser/views/components/single-preference-display-factory';
import { SinglePreferenceWrapper } from '@theia/preferences/lib/browser/views/components/single-preference-wrapper';
import { PreferencesSearchbarWidget } from '@theia/preferences/lib/browser/views/preference-searchbar-widget';
import { PreferencesScopeTabBar } from '@theia/preferences/lib/browser/views/preference-scope-tabbar-widget';
import { PreferencesDecorator } from '@theia/preferences/lib/browser/preferences-decorator';
import { PreferencesDecoratorService } from '@theia/preferences/lib/browser/preferences-decorator-service';
import { interfaces, Container } from 'inversify';
import { PreferenceTreeModelExt } from './preference-tree-model';

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
    child.bind(PreferencesDecorator).toSelf();
    child.bind(PreferencesDecoratorService).toSelf();
    child.rebind(TreeDecoratorService).toService(PreferencesDecoratorService);

    child.bind(SinglePreferenceWrapper).toSelf();
    child.bind(PreferencesSearchbarWidget).toSelf();
    child.bind(PreferencesScopeTabBar).toSelf();
    child.bind(SinglePreferenceDisplayFactory).toSelf();
    child.bind(PreferencesWidget).toSelf();

    return child;
}
