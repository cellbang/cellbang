import { METADATA_KEY } from '../constants';

export interface WidgetDefinitionOption {

}

export interface WidgetDefinitionMetadata {
    target: any;

}

export const WidgetDefinition = function (option: WidgetDefinitionOption = {}): ClassDecorator {
    return (t: any) => {
        const parsed = parseWidgetDefinitionOption(t, option);
        applyWidgetDefinitionDecorator(parsed, t);
    };
};

// const defaultWidgetDefinitionOption: WidgetDefinitionOption = {

// };

export function parseWidgetDefinitionOption(target: any, option: WidgetDefinitionOption) {
    return {};
}

export function applyWidgetDefinitionDecorator(option: WidgetDefinitionOption, target: any) {

    const metadata: WidgetDefinitionMetadata = {
        target
    };

    let metadatas: WidgetDefinitionMetadata[] = Reflect.getMetadata(
        METADATA_KEY.widgetDefinition,
        Reflect
    );

    if (!metadatas) {
        metadatas = [];
        Reflect.defineMetadata(
            METADATA_KEY.widgetDefinition,
            metadatas,
            Reflect
        );
    }
    metadatas.push(metadata);
    return metadata;
}
