import { Widget, WidgetManager } from '@theia/core/lib/browser';
import { Component, Autowired } from '@malagu/core';
import { LocaleService } from './locale';

@Component({ id: WidgetManager, rebind: true })
export class WidgetManagerExt extends WidgetManager {

    @Autowired(LocaleService)
    protected readonly localeService: LocaleService;

    async getOrCreateWidget<T extends Widget>(factoryId: string, options?: any): Promise<T> {
        const widget = await super.getOrCreateWidget(factoryId, options);
        const intl = await this.localeService.intl;
        const id = `${widget.constructor.name}.title.label`;
        widget.title.label = 
                intl.messages[id] ? intl.formatMessage({ id }) : widget.title.label && intl.messages[widget.title.label] ? intl.formatMessage({ id: widget.title.label }) : widget.title.label;
        return widget as T;
    }
}
