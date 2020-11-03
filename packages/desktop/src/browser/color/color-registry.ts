import { ColorRegistry, ColorDefinition, Color } from '@theia/core/lib/browser/color-registry';
import { Disposable } from '@theia/core/lib/common/disposable';
import { Component } from '@malagu/core';
import { ThemeService } from '@theia/core/lib/browser/theming';
import { Color as C, HSLA, RGBA } from './color';

@Component({ id: ColorRegistry, rebind: true })
export class ColorRegistryImpl extends ColorRegistry {

    protected colorsById: { [key: string]: ColorDefinition };

    constructor() {
        super();
		this.colorsById = {};
	}

    *getColors(): IterableIterator<string> {
        for (const id of Object.keys(this.colorsById)) {
            yield id;
        }
    }

    getCurrentColor(id: string): string | undefined {
        return this.toColor(this.getColor(id))?.toString();
    }

    protected doRegister(definition: ColorDefinition): Disposable {
        const { id } = definition;
        this.colorsById[id] = definition;
        return Disposable.create(() => delete this.colorsById[id]);
    }

    protected getColor(id: string): Color | undefined {
        const definition = this.colorsById[id];
        if (definition?.defaults) {
            return definition.defaults[ThemeService.get().getCurrentTheme().type];
        }
    }

    protected toColor(color: Color | undefined): C | undefined {
        if (!color) {
            return;
        }
        if (typeof color === 'string') {
            if (color[0] === '#') {
                return C.fromHex(color);
            }
            return this.toColor(this.getColor(color));
        } else if ('kind' in color) {
            const c: any = this.toColor(color.v);
            return c && c[color.kind](color.f);
        } else if ('r' in color) {
            const { r, g, b, a } = color;
            return new C(new RGBA(r, g, b, a));
        } else {
            const { h, s, l, a } = color;
            return new C(new HSLA(h, s, l, a));
        }
    }
}
