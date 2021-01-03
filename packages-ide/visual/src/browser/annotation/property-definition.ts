import { METADATA_KEY } from '../constants';

export interface PropertyDefinitionOption {

}

export interface PropertyDefinitionMetadata {

}
export const PropertyDefinition = function (option: PropertyDefinitionOption = {}): PropertyDecorator {
    return (target: any, targetKey: string | symbol) => {
        const parsed = parsePropertyDefinitionOption(target, targetKey, option);
        applyPropertyDefinitionDecorator(parsed, target, targetKey);
    };
};

// const defaultPropertyDefinitionOption: PropertyDefinitionOption = {

// };

export function parsePropertyDefinitionOption(target: any, targetKey: string | symbol, option: PropertyDefinitionOption) {
    return {};
}

export function applyPropertyDefinitionDecorator(option: PropertyDefinitionOption, target: any, targetKey: string | symbol) {

    const metadata: PropertyDefinitionMetadata = {
    };

    let metadatas: PropertyDefinitionMetadata[] = Reflect.getMetadata(
        METADATA_KEY.widgetDefinition,
        target
    );

    if (!metadatas) {
        metadatas = [];
        Reflect.defineMetadata(
            METADATA_KEY.widgetDefinition,
            metadatas,
            target
        );
    }
    metadatas.push(metadata);
    return metadata;
}

