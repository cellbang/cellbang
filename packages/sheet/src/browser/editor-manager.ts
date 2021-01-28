import { Component, PostConstruct, Autowired } from '@malagu/core';
import URI from '@theia/core/lib/common/uri';
import { RecursivePartial, Emitter, Event } from '@theia/core/lib/common';
import { WidgetOpenerOptions, NavigatableWidgetOpenHandler, OpenHandler } from '@theia/core/lib/browser';
import { ThemeService, ThemeType } from '@theia/core/lib/browser/theming';
import { Range } from './editor';
import { SheetEditorWidget } from './sheet-editor-widget';

export interface EditorOpenerOptions extends WidgetOpenerOptions {
    selection?: RecursivePartial<Range>;
    preview?: boolean;
}

const darkCss = require('../../src/browser/style/variables-dark.useable.css');
const lightCss = require('../../src/browser/style/variables-bright.useable.css');

@Component([EditorManager, OpenHandler])
export class EditorManager extends NavigatableWidgetOpenHandler<SheetEditorWidget> {

    readonly id = SheetEditorWidget.FACTORY_ID;

    readonly label = 'Table Editor';

    protected readonly onActiveEditorChangedEmitter = new Emitter<SheetEditorWidget | undefined>();
    /**
     * Emit when the active editor is changed.
     */
    readonly onActiveEditorChanged: Event<SheetEditorWidget | undefined> = this.onActiveEditorChangedEmitter.event;

    protected readonly onCurrentEditorChangedEmitter = new Emitter<SheetEditorWidget | undefined>();
    /**
     * Emit when the current editor is changed.
     */
    readonly onCurrentEditorChanged: Event<SheetEditorWidget | undefined> = this.onCurrentEditorChangedEmitter.event;

    @Autowired(ThemeService)
    protected readonly themeService: ThemeService;

    @PostConstruct()
    protected init(): void {
        super.init();
        // eslint-disable-next-line deprecation/deprecation
        this.shell.activeChanged.connect(() => this.updateActiveEditor());
        // eslint-disable-next-line deprecation/deprecation
        this.shell.currentChanged.connect(() => this.updateCurrentEditor());
        this.onCreated(widget => {
            widget.onDidChangeVisibility(() => {
                if (widget.isVisible) {
                    this.addRecentlyVisible(widget);
                } else {
                    this.removeRecentlyVisible(widget);
                }
                this.updateCurrentEditor();
            });
            widget.disposed.connect(() => {
                this.removeRecentlyVisible(widget);
                this.updateCurrentEditor();
            });
        });
        for (const widget of this.all) {
            if (widget.isVisible) {
                this.addRecentlyVisible(widget);
            }
        }
        this.updateCurrentEditor();
        this.themeService.onThemeChange(e => this.changeTheme(e.newTheme.type));
        this.changeTheme(this.themeService.getCurrentTheme().type);

    }

    protected changeTheme(type: ThemeType) {
        if (type === 'light') {
            lightCss.use();
            darkCss.unuse();
        } else {
            darkCss.use();
            lightCss.unuse();
        }
    }

    protected readonly recentlyVisibleIds: string[] = [];
    protected get recentlyVisible(): SheetEditorWidget | undefined {
        const id = this.recentlyVisibleIds[0];
        return id && this.all.find(w => w.id === id) || undefined;
    }
    protected addRecentlyVisible(widget: SheetEditorWidget): void {
        this.removeRecentlyVisible(widget);
        this.recentlyVisibleIds.unshift(widget.id);
    }
    protected removeRecentlyVisible(widget: SheetEditorWidget): void {
        const index = this.recentlyVisibleIds.indexOf(widget.id);
        if (index !== -1) {
            this.recentlyVisibleIds.splice(index, 1);
        }
    }

    protected _activeEditor: SheetEditorWidget | undefined;
    /**
     * The active editor.
     * If there is an active editor (one that has focus), active and current are the same.
     */
    get activeEditor(): SheetEditorWidget | undefined {
        return this._activeEditor;
    }
    protected setActiveEditor(active: SheetEditorWidget | undefined): void {
        if (this._activeEditor !== active) {
            this._activeEditor = active;
            this.onActiveEditorChangedEmitter.fire(this._activeEditor);
        }
    }
    protected updateActiveEditor(): void {
        const widget = this.shell.activeWidget;
        this.setActiveEditor(widget instanceof SheetEditorWidget ? widget : undefined);
    }

    protected _currentEditor: SheetEditorWidget | undefined;
    /**
     * The most recently activated editor (which might not have the focus anymore, hence it is not active).
     * If no editor has focus, e.g. when a context menu is shown, the active editor is `undefined`, but current might be the editor that was active before the menu popped up.
     */
    get currentEditor(): SheetEditorWidget | undefined {
        return this._currentEditor;
    }
    protected setCurrentEditor(current: SheetEditorWidget | undefined): void {
        if (this._currentEditor !== current) {
            this._currentEditor = current;
            this.onCurrentEditorChangedEmitter.fire(this._currentEditor);
        }
    }
    protected updateCurrentEditor(): void {
        const widget = this.shell.currentWidget;
        if (widget instanceof SheetEditorWidget) {
            this.setCurrentEditor(widget);
        } else if (!this._currentEditor || !this._currentEditor.isVisible || this.currentEditor !== this.recentlyVisible) {
            this.setCurrentEditor(this.recentlyVisible);
        }
    }

    canHandle(uri: URI, options?: WidgetOpenerOptions): number {
        if (uri.path.ext !== '.xlsx') {
            return 0;
        }
        return 200;
    }

    async open(uri: URI, options?: EditorOpenerOptions): Promise<SheetEditorWidget> {
        const editor = await super.open(uri, options);
        return editor;
    }

}

