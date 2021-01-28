import { Widget, BaseWidget, Message, Navigatable, StatefulWidget, Saveable, ContextMenuRenderer } from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { SheetEditor } from './editor';
import { MonacoEditorModel } from '@theia/monaco/lib/browser/monaco-editor-model';
import { MonacoTextModelService } from '@theia/monaco/lib/browser/monaco-text-model-service';
import { Reference, SelectionService, Event, Disposable} from '@theia/core';
import { Injectable, Autowired, PostConstruct } from '@malagu/core';
import { LabelProvider, NavigatableWidgetOptions, SaveableSource } from '@theia/core/lib/browser';
import { SheetEditorImpl } from './sheet-editor';
import { MonacoWorkspace } from '@theia/monaco/lib/browser/monaco-workspace';
import { LocaleManager } from '@malagu/widget';
import * as ReactDOM from 'react-dom';
import { SHEET_CONTEXT_MENU } from './sheet-context-menu';

export const SheetEditorWidgetOptions = Symbol('SheetEditorWidgetOptions');
export interface SheetEditorWidgetOptions extends NavigatableWidgetOptions {
    reference: Reference<MonacoEditorModel>;
}

@Injectable()
export class SheetEditorWidget extends BaseWidget implements SaveableSource, Navigatable, StatefulWidget {

    static FACTORY_ID = 'sheet-editor-opener';

    @Autowired(SheetEditorWidgetOptions)
    protected readonly sheetEditorWidgetOptions: SheetEditorWidgetOptions;

    @Autowired(LabelProvider)
    protected readonly labelProvider: LabelProvider;

    @Autowired(LocaleManager)
    protected readonly localeManager: LocaleManager;

    @Autowired(SelectionService)
    protected readonly selectionService: SelectionService;

    @Autowired(MonacoTextModelService)
    protected readonly modelService: MonacoTextModelService;

    @Autowired(MonacoWorkspace)
    protected readonly workspace: MonacoWorkspace;

    @Autowired(ContextMenuRenderer)
    protected readonly contextMenuRenderer: ContextMenuRenderer;

    editor: SheetEditor;

    protected uri: URI;

    @PostConstruct()
    protected async init(): Promise<void> {
        this.uri = new URI(this.sheetEditorWidgetOptions.uri);

        this.setLabels();
        const labelListener = this.labelProvider.onDidChange(event => {
            if (event.affects(this.uri)) {
                this.setLabels();
            }
        });
        this.onDispose(() => labelListener.dispose());

        this.id = this.id + ':' + this.uri.toString();
        this.title.closable = true;

        if (this.toDispose.disposed) {
            this.sheetEditorWidgetOptions.reference.dispose();
            return;
        }
        this.toDispose.push(this.sheetEditorWidgetOptions.reference);
    }

    protected setLabels(): void {
        this.title.caption = this.labelProvider.getLongName(this.uri);
        const icon = this.labelProvider.getIcon(this.uri);
        this.title.label = this.labelProvider.getName(this.uri);
        this.title.iconClass = icon + ' file-icon';
    }

    get saveable(): Saveable {
        return this.sheetEditorWidgetOptions.reference.object;
    }

    getResourceUri(): URI | undefined {
        return this.editor?.getResourceUri();
    }

    createMoveToUri(resourceUri: URI): URI | undefined {
        return this.editor?.createMoveToUri(resourceUri);
    }

    protected onActivateRequest(msg: Message): void {
        super.onActivateRequest(msg);
        this.selectionService.selection = this.editor;
    }

    protected onAfterAttach(msg: Message): void {
        super.onAfterAttach(msg);
        if (this.isVisible) {
            this.refreshOrCreateEditor();
        }
        this.addEventListener(this.node, 'contextmenu', e => {
            const target = e.target as any;
            if (target.tagName?.toLowerCase() !== 'li') {
                this.contextMenuRenderer.render({
                    menuPath: SHEET_CONTEXT_MENU,
                    anchor: e
                });
                e.stopPropagation();
                e.preventDefault();
            }
        }, true);
    }

    protected onAfterShow(msg: Message): void {
        super.onAfterShow(msg);
        this.refreshOrCreateEditor();
    }

    protected refreshOrCreateEditor() {
        const model = this.sheetEditorWidgetOptions.reference.object;
        if (this.editor) {
            this.editor.refresh();
        } else {
            const host = document.createElement('div');
            this.toDispose.push(Disposable.create(() => ReactDOM.unmountComponentAtNode(host)));
            this.node.appendChild(host);
            this.editor = new SheetEditorImpl(model, this.localeManager, this.workspace, this.uri);
            this.toDispose.push(this.editor);
            this.editor.create(host);
        }
    }

    protected onResize(msg: Widget.ResizeMessage): void {
        this.editor?.resize(msg);
    }

    storeState(): object {
        return this.editor?.storeViewState();
    }

    restoreState(oldState: object): void {
        this.editor?.restoreViewState(oldState);
    }

    get onDispose(): Event<void> {
        return this.toDispose.onDispose;
    }
}
