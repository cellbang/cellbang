import URI from '@theia/core/lib/common/uri';
import { DisposableCollection, Event } from '@theia/core/lib/common';
import { MonacoEditorModel } from '@theia/monaco/lib/browser/monaco-editor-model';
import { SheetEditor, Dimension } from './editor';
import * as jsoncparser from 'jsonc-parser';
import * as traverse from 'traverse';
import { MonacoWorkspace } from '@theia/monaco/lib/browser/monaco-workspace';
import debounce = require('lodash.debounce');
const spreadsheet = require('x-data-spreadsheet');
import { LocaleManager } from '@malagu/widget';

export class SheetEditorImpl implements SheetEditor {

    protected readonly toDispose = new DisposableCollection();

    editor: any;
    protected dataTraverse: traverse.Traverse<any>;

    constructor(
        readonly model: MonacoEditorModel,
        readonly localeManager: LocaleManager,
        readonly workspace: MonacoWorkspace,
        readonly uri: URI
    ) {
        this.localeManager.currentSubject.subscribe(l => {
            if (l?.lang === 'zh-CN') {
                spreadsheet.locale('zh-cn');
            }
        });
    }

    create(host: HTMLElement, options?: {}): void {
        const initData = jsoncparser.parse(jsoncparser.stripComments(this.model.getText())) || {};
        this.dataTraverse = traverse(jsoncparser.parse(jsoncparser.stripComments(this.model.getText())) || []);

        const parent = host.parentElement as HTMLElement;

        this.editor = spreadsheet(host, {
            showContextmenu: false,
            view: {
                height: () => parent.clientHeight,
                width: () =>  parent.clientWidth
            }
        });
        const onChange = debounce((data: any) => this.onChange(data), 300);
        this.editor.loadData(initData);
        this.editor.change(onChange);
    }

    protected onChange(data: any) {
        const model = this.model.textEditorModel;
        const content = model.getValue();
        const edits: jsoncparser.Edit[] = [];
        const self = this;
        const paths: (string | number)[] = [];
        traverse(this.editor.getData()).forEach(function (value: any) {
            let parts: jsoncparser.Edit[] = [];
            if (this.key) {
                let i = paths.length;
                while (i >= this.path.length) {
                    paths.pop();
                    i--;
                }
                if (Array.isArray(this.parent?.node)) {
                    paths.push(parseInt(this.key));
                } else {
                    paths.push(this.key);
                }
            }
            if (this.path.length === 1 && value?.name !== data.name) {
                this.update(value, true);
            }
            if (this.isLeaf) {
                if (JSON.stringify(self.dataTraverse.get(this.path)) !== JSON.stringify(value)) {
                    parts = jsoncparser.modify(content, paths, value, { });
                    self.dataTraverse.set(this.path, JSON.parse(JSON.stringify(value)));
                }
            } else {
                const oldValue = self.dataTraverse.get(this.path);
                if (!oldValue || (Array.isArray(oldValue) && !oldValue.length) || !Object.keys(oldValue).length ) {
                    parts = jsoncparser.modify(content, paths, value, { });
                    self.dataTraverse.set(this.path, JSON.parse(JSON.stringify(value)));
                    this.update(value, true);
                }
            }
            edits.push(...parts);
        });
        this.workspace.applyBackgroundEdit(this.model, edits.map(e => {
            const start = model.getPositionAt(e.offset);
            const end = model.getPositionAt(e.offset + e.length);
                return {
                    range: monaco.Range.fromPositions(start, end),
                    text: e.content
                };
        }));
    }

    refresh(): void {
        if (this.editor) {
            this.editor.sheet.reload();
        }
    }

    get onDispose(): Event<void> {
        return this.toDispose.onDispose;
    }

    dispose(): void {
        this.toDispose.dispose();
    }

    resize(dimension: Dimension | undefined): void {
        this.refresh();
    }

    storeViewState(): object {
        return {};
    }

    restoreViewState(state: any): void {
    }

    getResourceUri(): URI {
        return this.uri;
    }
    createMoveToUri(resourceUri: URI): URI {
        return this.uri.withPath(resourceUri.path);
    }

}
