
import '../../src/browser/style/index.css';
import { autoBind } from '@malagu/core';
import { MembersWidget, MembersWidgetOptions } from './members-widget';
import { WidgetFactory } from '@theia/core/lib/browser';
import { NavigatableWidgetOptions } from '@theia/core/lib/browser';

import '.';

export default autoBind(bind => {
    bind(WidgetFactory).toDynamicValue(({ container }) => ({
        id: MembersWidget.FACTORY_ID,
        createWidget: async (options: NavigatableWidgetOptions) => {
            const child = container.createChild();
            child.bind(MembersWidgetOptions).toConstantValue({ ...options });
            child.bind(MembersWidget).toSelf();
            return child.get(MembersWidget);
        }
    }));
});
