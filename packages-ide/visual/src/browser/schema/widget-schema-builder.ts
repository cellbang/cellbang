import { Property, WidgetSchema, WidgetSchemaBuilder } from './schema-protocol';
import { Component } from '@malagu/core';
import { METADATA_KEY } from '../constants';
import { WidgetDefinitionMetadata } from '../annotation/widget-definition';
import { PropertyDefinitionMetadata } from '../annotation';

@Component(WidgetSchemaBuilder)
export class DefaultWidgetSchemaBuilder implements WidgetSchemaBuilder {

    async build(): Promise<WidgetSchema[]> {
        const metadatas: WidgetDefinitionMetadata[] = Reflect.getMetadata(
            METADATA_KEY.widgetDefinition,
            Reflect
        ) || [];

        const widgetSchemas: WidgetSchema[] = [];

        for (const metadata of metadatas) {
            widgetSchemas.push(await this.parseWidgetSchema(metadata));
        }

        return widgetSchemas;
    }

    protected async parseWidgetSchema(widgetMetadata: WidgetDefinitionMetadata): Promise<WidgetSchema> {
        const { target } = widgetMetadata;
        const metadatas: PropertyDefinitionMetadata[] = Reflect.getMetadata(
            METADATA_KEY.propertyDefinition,
            target
        ) || [];

        const properties: Property[] = [];

        for (const metadata of metadatas) {
            properties.push(await this.parseProperty(metadata));
        }

        const widgetSchema = {
            properties
        };
        return widgetSchema;
    }

    protected async parseProperty(propertyMatedata: PropertyDefinitionMetadata): Promise<Property[]> {
        return [];
    }
}
