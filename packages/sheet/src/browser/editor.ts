import URI from '@theia/core/lib/common/uri';
import { Disposable, TextDocumentContentChangeDelta } from '@theia/core/lib/common';
import { Saveable, Navigatable } from '@theia/core/lib/browser';
import { MonacoEditorModel } from '@theia/monaco/lib/browser/monaco-editor-model';

export interface SheetEditorDocument extends Saveable, Disposable {

}

export interface SheetDocumentChangeEvent {
    readonly document: SheetEditorDocument;
    readonly contentChanges: TextDocumentContentChangeDelta[];
}

export interface SheetEditor extends Disposable, Navigatable {
    readonly uri: URI;
    readonly model: MonacoEditorModel;

    refresh(): void;

    create(host: HTMLElement, options?: {}): void;

    resize(dimension: Dimension | undefined): void;

    storeViewState(): object;
    restoreViewState(state: object): void;

}

export interface Dimension {
    width: number;
    height: number;
}

export interface Range {

}
