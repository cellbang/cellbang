import { Widget, WidgetManager } from '@theia/core/lib/browser';
import { Component, Autowired } from '@malagu/core';
import { LocaleService } from './locale';
import { IntlUtil } from './utils';

@Component({ id: WidgetManager, rebind: true })
export class WidgetManagerExt extends WidgetManager {

    @Autowired(LocaleService)
    protected readonly localeService: LocaleService;

    async getOrCreateWidget<T extends Widget>(factoryId: string, options?: any): Promise<T> {
        const widget = await super.getOrCreateWidget(factoryId, options);
        await this.localeService.intl;
        let id = `${widget.constructor.name}.title.label`;
        widget.title.label = IntlUtil.get(id, widget.title.label)!;

        id = `${widget.constructor.name}.title.caption`;
        widget.title.caption = IntlUtil.get(id, widget.title.caption)!;
        return widget as T;
    }
}
