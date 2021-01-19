
import { autoBind } from '@malagu/core';
import { SheetEditorWidget, SheetEditorWidgetOptions } from './sheet-editor-widget';
import { WidgetFactory } from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { NavigatableWidgetOptions } from '@theia/core/lib/browser';
import { MonacoTextModelService } from '@theia/monaco/lib/browser/monaco-text-model-service';

import '.';

export default autoBind(bind => {
    bind(WidgetFactory).toDynamicValue(({ container }) => ({
        id: SheetEditorWidget.FACTORY_ID,
        createWidget: async (options: NavigatableWidgetOptions) => {
            const modelServie = container.get<MonacoTextModelService>(MonacoTextModelService);
            const reference = await modelServie.createModelReference(new URI(options.uri));
            const child = container.createChild();
            child.bind(SheetEditorWidgetOptions).toConstantValue({ ...options, reference });
            child.bind(SheetEditorWidget).toSelf();
            return child.get(SheetEditorWidget);
        }
    }));
});
