
import { autoBind } from '@malagu/core';
import { createFileNavigatorContainer } from '@theia/navigator/lib/browser/navigator-container';
import { FileNavigatorWidget } from '@theia/navigator/lib/browser/navigator-widget';
import '.';
import { FileNavigatorWidgetExt } from './navigator-widget';

export default autoBind((bind, unbind, isBound, rebind) => {
    rebind(FileNavigatorWidget).toDynamicValue(ctx => {
        const container = createFileNavigatorContainer(ctx.container);
        container.rebind(FileNavigatorWidget).to(FileNavigatorWidgetExt);
        return container.get(FileNavigatorWidget);
    });
});
