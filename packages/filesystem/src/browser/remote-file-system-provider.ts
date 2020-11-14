import { postConstruct } from 'inversify';
import URI from '@theia/core/lib/common/uri';
import { Emitter } from '@theia/core/lib/common/event';
import { Disposable } from '@theia/core/lib/common/disposable';
import type { TextDocumentContentChangeEvent } from 'vscode-languageserver-protocol';
import { RemoteFileSystemProvider } from '@theia/filesystem/lib/common/remote-file-system-provider';
import { FileChange, FileChangeType, FileDeleteOptions, FileOverwriteOptions, FileUpdateOptions,
FileUpdateResult, FileWriteOptions, WatchOptions } from '@theia/filesystem/lib/common/files';
import { Component, Deferred } from '@malagu/core';

@Component({ id: RemoteFileSystemProvider, rebind: true })
export class RemoteFileSystemProviderExt extends RemoteFileSystemProvider {

    readonly emitter = new Emitter<readonly FileChange[]>();
    readonly onDidChangeFile = this.emitter.event;

    protected readonly cacheMap = new Map<string, { data: Deferred<any>, time: Date }>();

    @postConstruct()
    protected init(): void {
        super.init();
        this.toDispose.push(this.emitter);
        this.toDispose.push(Disposable.create(() => this.cacheMap.clear()));
    }

    async writeFile(resource: URI, content: Uint8Array, opts: FileWriteOptions): Promise<void> {
        await super.writeFile(resource, content, opts);
        this.emitter.fire([{ type: FileChangeType.UPDATED, resource }]);
    }

    async delete(resource: URI, opts: FileDeleteOptions): Promise<void> {
        await super.delete(resource, opts);
        this.emitter.fire([{ type: FileChangeType.DELETED, resource }]);
    }

    async mkdir(resource: URI): Promise<void> {
        await super.mkdir(resource);
        this.emitter.fire([{ type: FileChangeType.ADDED, resource }]);
    }

    async rename(resource: URI, target: URI, opts: FileOverwriteOptions): Promise<void> {
        await super.rename(resource, target, opts);
        this.emitter.fire([{ type: FileChangeType.DELETED, resource }]);
        this.emitter.fire([{ type: FileChangeType.ADDED, resource: target }]);
    }

    async copy(resource: URI, target: URI, opts: FileOverwriteOptions): Promise<void> {
        await super.copy(resource, target, opts);
        this.emitter.fire([{ type: FileChangeType.ADDED, resource: target }]);
    }

    async updateFile(resource: URI, changes: TextDocumentContentChangeEvent[], opts: FileUpdateOptions): Promise<FileUpdateResult> {
        const result = await super.updateFile(resource, changes, opts);
        this.emitter.fire([{ type: FileChangeType.UPDATED, resource }]);
        return result;
    }

    watch(resource: URI, options: WatchOptions): Disposable {
        return Disposable.NULL;
    }

    protected reconnect(): void {

    }

}
