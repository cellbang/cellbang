import { MenuPath } from '@theia/core/lib/common';

export const SHEET_CONTEXT_MENU: MenuPath = ['sheet-context-menu'];

export namespace SheetContenxtMenu {

    export const COPY = [...SHEET_CONTEXT_MENU, '1_copy'];
    export const PASTE = [...SHEET_CONTEXT_MENU, '2_paste'];
    export const INSERT = [...SHEET_CONTEXT_MENU, '3_insert'];
    export const DELETE = [...SHEET_CONTEXT_MENU, '4_delete'];
    export const VALIDATE = [...SHEET_CONTEXT_MENU, '5_validate'];
    export const EXPORT = [...SHEET_CONTEXT_MENU, '6_export'];
    export const EDIT = [...SHEET_CONTEXT_MENU, '7_edit'];
}
