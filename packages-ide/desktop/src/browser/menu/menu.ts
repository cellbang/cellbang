import { Disposable, MenuAction, MenuModelRegistry, MenuPath, SubMenuOptions } from '@theia/core';
import { Component } from '@malagu/core';
import { IntlUtil } from '../utils';

@Component({ id: MenuModelRegistry, rebind: true })
export class MenuModelRegistryExt extends MenuModelRegistry {

    registerMenuAction(menuPath: MenuPath, item: MenuAction): Disposable {
        const id = `${item.commandId}.label`;
        item.label = IntlUtil.get(id, item.label);
        return super.registerMenuAction(menuPath, item);
    }

    registerSubmenu(menuPath: MenuPath, label: string, options?: SubMenuOptions): Disposable {
        label = IntlUtil.get(label)!;
        return super.registerSubmenu(menuPath, label, options);
    }
}
