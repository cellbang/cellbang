import {
    KeybindingRegistry,
    KeybindingContribution
} from '@theia/core/lib/browser';
import {
    Command,
    CommandRegistry,
    MenuModelRegistry,
    CommandContribution,
    MenuContribution,
} from '@theia/core/lib/common';
import { Component, Autowired } from '@malagu/core';
import { LabelProvider, CommonCommands } from '@theia/core/lib/browser';
import { ClipboardService } from '@theia/core/lib/browser/clipboard-service';
import { MessageService, SelectionService } from '@theia/core';
import { EditorManager } from './editor-manager';
import { SheetContenxtMenu } from './sheet-context-menu';

export namespace SheetCommands {
    export const PASTE_VALUE: Command = {
        id: 'sheet.paste.values',
        label: 'Paste values only'
    };

    export const PASTE_FORMAT: Command = {
        id: 'sheet.paste.format',
        label: 'Paste format only'
    };

    export const INSERT_ROW: Command = {
        id: 'sheet.insert.row',
        label: 'Insert row'
    };

    export const INSERT_COLUMN: Command = {
        id: 'sheet.insert.column',
        label: 'Insert column'
    };

    export const DELETE_ROW: Command = {
        id: 'sheet.delete.row',
        label: 'Delete row'
    };

    export const DELETE_COLUMN: Command = {
        id: 'sheet.delete.column',
        label: 'Delete column'
    };

    export const DELETE_CELL_TEXT: Command = {
        id: 'sheet.delte.cell.text',
        label: 'Delete cell text'
    };

    export const DATA_VALIDATIONS: Command = {
        id: 'sheet.data.validations',
        label: 'Data validations'
    };

    export const ENABLE_EXPORT: Command = {
        id: 'sheet.enable.export',
        label: 'Enable export'
    };

    export const DISABLE_EXPORT: Command = {
        id: 'sheet.disable.export',
        label: 'Disable export'
    };

    export const ENABLE_EDITING: Command = {
        id: 'sheet.enable.editing',
        label: 'Enable editing'
    };

    export const DISABLE_EDITING: Command = {
        id: 'sheet.disable.editing',
        label: 'Disable editing'
    };
}

@Component([SheetContribution, CommandContribution, MenuContribution, KeybindingContribution])
export class SheetContribution implements CommandContribution, MenuContribution, KeybindingContribution {

    @Autowired(EditorManager)
    protected readonly editorManager: EditorManager;

    @Autowired(LabelProvider)
    protected readonly labelProvider: LabelProvider;

    @Autowired(ClipboardService)
    protected readonly clipboardService: ClipboardService;

    @Autowired(MessageService)
    protected readonly messageService: MessageService;

    @Autowired(SelectionService)
    protected readonly selectionService: SelectionService;

    registerCommands(registry: CommandRegistry): void {

        registry.registerHandler(CommonCommands.UNDO.id, {
            isEnabled: () => !!this.editorManager.currentEditor,
            execute: () => this.executeToolbar('undo')
        });

        registry.registerHandler(CommonCommands.REDO.id, {
            isEnabled: () => !!this.editorManager.currentEditor,
            execute: () => this.executeToolbar('redo')
        });

        registry.registerHandler(CommonCommands.COPY.id, {
            isEnabled: () => !!this.editorManager.currentEditor,
            execute: () => this.execute('copy')
        });

        registry.registerHandler(CommonCommands.COPY.id, {
            isEnabled: () => !!this.editorManager.currentEditor,
            execute: () => this.execute('copy')
        });

        registry.registerHandler(CommonCommands.CUT.id, {
            isEnabled: () => !!this.editorManager.currentEditor,
            execute: () => this.execute('cut')
        });

        registry.registerHandler(CommonCommands.PASTE.id, {
            isEnabled: () => !!this.editorManager.currentEditor,
            execute: () => this.execute('paste')
        });

        registry.registerCommand(SheetCommands.PASTE_VALUE, {
            isEnabled: () => !!this.editorManager.currentEditor,
            execute: () => this.execute('paste-value')
        });

        registry.registerCommand(SheetCommands.PASTE_FORMAT, {
            isEnabled: () => !!this.editorManager.currentEditor,
            execute: () => this.execute('paste-format')
        });

        registry.registerCommand(SheetCommands.INSERT_ROW, {
            isEnabled: () => !!this.editorManager.currentEditor,
            execute: () => this.execute('insert-row')
        });

        registry.registerCommand(SheetCommands.INSERT_COLUMN, {
            isEnabled: () => !!this.editorManager.currentEditor,
            execute: () => this.execute('insert-column')
        });

        registry.registerCommand(SheetCommands.DELETE_ROW, {
            isEnabled: () => !!this.editorManager.currentEditor,
            execute: () => this.execute('delete-row')
        });

        registry.registerCommand(SheetCommands.DELETE_COLUMN, {
            isEnabled: () => !!this.editorManager.currentEditor,
            execute: () => this.execute('delete-column')
        });

        registry.registerCommand(SheetCommands.DELETE_CELL_TEXT, {
            isEnabled: () => !!this.editorManager.currentEditor,
            execute: () => this.execute('delete-cell-text')
        });

        registry.registerCommand(SheetCommands.DATA_VALIDATIONS, {
            isEnabled: () => !!this.editorManager.currentEditor,
            execute: () => this.execute('validation')
        });

        registry.registerCommand(SheetCommands.ENABLE_EXPORT, {
            isEnabled: () => !!this.editorManager.currentEditor,
            execute: () => this.execute('cell-printable')
        });

        registry.registerCommand(SheetCommands.DISABLE_EXPORT, {
            isEnabled: () => !!this.editorManager.currentEditor,
            execute: () => this.execute('cell-non-printable')
        });

        registry.registerCommand(SheetCommands.ENABLE_EDITING, {
            isEnabled: () => !!this.editorManager.currentEditor,
            execute: () => this.execute('cell-editable')
        });

        registry.registerCommand(SheetCommands.DISABLE_EDITING, {
            isEnabled: () => !!this.editorManager.currentEditor,
            execute: () => this.execute('cell-non-editable')
        });
    }

    protected execute(type: string) {
        this.editorManager.currentEditor!.editor.editor.sheet.contextMenu.itemClick(type);
    }

    protected executeToolbar(type: string, value?: any) {
        this.editorManager.currentEditor!.editor.editor.sheet.toolbar.change(type, value);
    }

    registerMenus(registry: MenuModelRegistry): void {
        registry.registerMenuAction(SheetContenxtMenu.COPY, {
            commandId: CommonCommands.COPY.id,
            order: 'a'
        });

        registry.registerMenuAction(SheetContenxtMenu.COPY, {
            commandId: CommonCommands.CUT.id,
            order: 'b'
        });

        registry.registerMenuAction(SheetContenxtMenu.PASTE, {
            commandId: CommonCommands.PASTE.id,
            order: 'a'
        });

        registry.registerMenuAction(SheetContenxtMenu.PASTE, {
            commandId: SheetCommands.PASTE_VALUE.id,
            order: 'b'
        });

        registry.registerMenuAction(SheetContenxtMenu.PASTE, {
            commandId: SheetCommands.PASTE_FORMAT.id,
            order: 'c'
        });

        registry.registerMenuAction(SheetContenxtMenu.INSERT, {
            commandId: SheetCommands.INSERT_ROW.id,
            order: 'a'
        });

        registry.registerMenuAction(SheetContenxtMenu.INSERT, {
            commandId: SheetCommands.INSERT_COLUMN.id,
            order: 'b'
        });

        registry.registerMenuAction(SheetContenxtMenu.DELETE, {
            commandId: SheetCommands.DELETE_ROW.id,
            order: 'a'
        });

        registry.registerMenuAction(SheetContenxtMenu.DELETE, {
            commandId: SheetCommands.DELETE_COLUMN.id,
            order: 'b'
        });

        registry.registerMenuAction(SheetContenxtMenu.DELETE, {
            commandId: SheetCommands.DELETE_CELL_TEXT.id,
            order: 'c'
        });

        registry.registerMenuAction(SheetContenxtMenu.VALIDATE, {
            commandId: SheetCommands.DATA_VALIDATIONS.id,
            order: 'a'
        });

        registry.registerMenuAction(SheetContenxtMenu.EXPORT, {
            commandId: SheetCommands.ENABLE_EXPORT.id,
            order: 'a'
        });

        registry.registerMenuAction(SheetContenxtMenu.EXPORT, {
            commandId: SheetCommands.DISABLE_EXPORT.id,
            order: 'b'
        });

        registry.registerMenuAction(SheetContenxtMenu.EDIT, {
            commandId: SheetCommands.ENABLE_EDITING.id,
            order: 'a'
        });

        registry.registerMenuAction(SheetContenxtMenu.EDIT, {
            commandId: SheetCommands.DISABLE_EDITING.id,
            order: 'b'
        });

    }

    registerKeybindings(registry: KeybindingRegistry): void {

    }

}
