export const WidgetSchema = Symbol('WidgetSchema');
export const WidgetSchemaProvider = Symbol('WidgetSchemaProvider');
export const WidgetSchemaBuilder = Symbol('WidgetSchemaBuilder');

export interface Property {

}

export interface WidgetSchema {

    properties: Property[]

}

export interface WidgetSchemaProvider {
    provide(): Promise<WidgetSchema[]>;
}

export interface WidgetSchemaBuilder {
    build(): Promise<WidgetSchema[]>;
}
