import { ConfigUtil } from '@malagu/core';

const { cellbang: { desktop } } = ConfigUtil.getRaw();

export namespace Condition {

    export function isEditorMode() {
        return desktop.editorMode;
    }
}
