import { Disposable } from '@theia/core';
import { ReactTabBarToolbarItem, TabBarToolbarItem, TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { Component, Autowired } from '@malagu/core';
import { LocaleService } from '../locale';
import { IntlUtil } from '../utils';

@Component({ id: TabBarToolbarRegistry, rebind: true })
export class TabBarToolbarRegistryExt extends TabBarToolbarRegistry {

    @Autowired(LocaleService)
    protected readonly localeService: LocaleService;

    registerItem(item: TabBarToolbarItem | ReactTabBarToolbarItem): Disposable {

        if (TabBarToolbarItem.is(item)) {
            const newItem = { ...item };
            newItem.text = IntlUtil.get(item.text);
            newItem.tooltip = IntlUtil.get(item.tooltip);
            return super.registerItem(newItem);
        }
        return super.registerItem(item);
    }
}
