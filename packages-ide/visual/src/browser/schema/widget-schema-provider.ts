import { WidgetSchema, WidgetSchemaBuilder, WidgetSchemaProvider } from './schema-protocol';
import { PostConstruct, Autowired, Component } from '@malagu/core';

@Component(WidgetSchemaProvider)
export class DefaultWidgetSchemaProvider implements WidgetSchemaProvider {

    protected _widgetSchemas: WidgetSchema[];

    @Autowired(WidgetSchemaBuilder)
    protected readonly widgetSchemaBuilder: WidgetSchemaBuilder;

    @PostConstruct()
    protected async init() {
        if (!this._widgetSchemas) {
            this._widgetSchemas = await this.widgetSchemaBuilder.build();
        }

    }

    async provide(): Promise<WidgetSchema[]> {
        return this._widgetSchemas;
    }

}
