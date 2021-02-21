
import '../../src/browser/style/index.css';
import { autoBind } from '@malagu/core';
import { PageWidget, PageWidgetOptions } from './page-widget';
import { WidgetFactory } from '@theia/core/lib/browser';
import { NavigatableWidgetOptions } from '@theia/core/lib/browser';

import '.';

export default autoBind(bind => {
    bind(WidgetFactory).toDynamicValue(({ container }) => ({
        id: PageWidget.FACTORY_ID,
        createWidget: async (options: NavigatableWidgetOptions) => {
            const child = container.createChild();
            child.bind(PageWidgetOptions).toConstantValue({ ...options });
            child.bind(PageWidget).toSelf();
            return child.get(PageWidget);
        }
    }));
});
