import { Disposable, MenuAction, MenuModelRegistry, MenuPath, SubMenuOptions } from '@theia/core';
import { Component, Autowired } from '@malagu/core';
import { LocaleService } from '../locale';

@Component({ id: MenuModelRegistry, rebind: true })
export class MenuModelRegistryExt extends MenuModelRegistry {

    @Autowired(LocaleService)
    protected readonly localeService: LocaleService;

    registerMenuAction(menuPath: MenuPath, item: MenuAction): Disposable {
        const intl = this.localeService.tryGetIntl();
        if (item.label && intl) {
            const id = `${item.commandId}.label`;
            item.label = intl.messages[id] ? intl.formatMessage({ id }) : intl.messages[item.label] ? intl.formatMessage({ id: item.label }) : item.label;
        }
        return super.registerMenuAction(menuPath, item);
    }

    registerSubmenu(menuPath: MenuPath, label: string, options?: SubMenuOptions): Disposable {
        const intl = this.localeService.tryGetIntl();
        if (label && intl) {
            label = intl.messages[label] ? intl.formatMessage({ id: label }) : label;
        }
        return super.registerSubmenu(menuPath, label, options);
    }
}
