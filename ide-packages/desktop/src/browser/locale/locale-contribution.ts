
import { Component, Autowired } from '@malagu/core';
import { MenuModelRegistry, CommandRegistry, SETTINGS_MENU, CommandContribution, MenuContribution } from '@theia/core';
import { LocaleManager } from '@malagu/widget';
import { LocaleService } from './locale-protocol';

export const SETTINGS__LOCALE = [...SETTINGS_MENU, '3_settings_locale'];

@Component([LocaleContribution, MenuContribution, CommandContribution])
export class LocaleContribution implements MenuContribution, CommandContribution {

    @Autowired(LocaleManager)
    protected readonly localeManager: LocaleManager;

    @Autowired(LocaleService)
    protected readonly localeService: LocaleService;

    registerCommands(commandRegistry: CommandRegistry): void {
        this.localeManager.get().then(locales => {
            for (const locale of locales) {
                commandRegistry.registerCommand({
                    id: `workbench.action.language.${locale.lang}`,
                    label: this.localeService.tryGetIntl().formatDisplayName(locale.lang, { type: 'language' }) || locale.label || locale.lang,
                    category: 'Preferences'
                }, {
                    execute: (l => () => {
                        this.localeManager.currentSubject.next(l);
                        window.location.reload();
                    })(locale),
                    isToggled: (l => () => {
                        const value = this.localeService.tryGetLocale();
                        return !!value && value.lang === l.lang;
                    })(locale)
                });
            }
        });
    }

    registerMenus(registry: MenuModelRegistry): void {
        this.localeManager.get().then(locales => {
            registry.unregisterMenuNode(registry.getMenu(SETTINGS__LOCALE).id);
            for (const locale of locales) {
                registry.registerMenuAction(SETTINGS__LOCALE, {
                    commandId: `workbench.action.language.${locale.lang}`
                });
            }
        });
    }
}
