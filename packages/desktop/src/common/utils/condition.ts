import { ConfigUtil } from '@malagu/core';

const { cellbang: { desktop } } = ConfigUtil.getAll();

export namespace Condition {

    export function isEditorMode() {
        return desktop.editorMode;
    }
}
