import { postConstruct } from 'inversify';
import URI from '@theia/core/lib/common/uri';
import { Emitter } from '@theia/core/lib/common/event';
import { Disposable } from '@theia/core/lib/common/disposable';
import type { TextDocumentContentChangeEvent } from 'vscode-languageserver-protocol';
import { RemoteFileSystemProvider } from '@theia/filesystem/lib/common/remote-file-system-provider';
import { FileChange, FileChangeType, FileDeleteOptions, FileOverwriteOptions, FileType, FileUpdateOptions,
FileUpdateResult, FileWriteOptions, WatchOptions, Stat } from '@theia/filesystem/lib/common/files';
import { Component, Autowired, Named } from '@malagu/core';
import { CacheManager } from '@malagu/cache';

@Component({ id: RemoteFileSystemProvider, rebind: true })
export class RemoteFileSystemProviderExt extends RemoteFileSystemProvider {

    readonly emitter = new Emitter<readonly FileChange[]>();
    readonly onDidChangeFile = this.emitter.event;

    @Autowired(CacheManager)
    @Named('filesystem')
    protected readonly cacheManager: CacheManager;

    @postConstruct()
    protected init(): void {
        super.init();
        this.toDispose.push(this.emitter);
        this.toDispose.push(Disposable.create(() => this.cacheManager.reset()));
    }

    async delCache(recursive: boolean, ...resources: URI[]) {

        for (const resource of resources) {
            const key1 = `stat:${resource.toString()}`;
            const key2 = `readdir:${resource.toString()}`;
            if (!recursive) {
                await this.cacheManager.del(key1);
                await this.cacheManager.del(key2);
                return;
            }
            const keys = await this.cacheManager.store.keys!();
            for (const key of keys || []) {
                if (key.startsWith(key1) || key.startsWith(key2)) {
                    await this.cacheManager.del(key);
                }
            }
        }

    }

    stat(resource: URI): Promise<Stat> {
        return this.cacheManager.wrap(`stat:${resource.toString()}`, () => super.stat(resource));
    }

    readdir(resource: URI): Promise<[string, FileType][]> {
        return this.cacheManager.wrap(`readdir:${resource.toString()}`, () => super.readdir(resource));
    }

    async writeFile(resource: URI, content: Uint8Array, opts: FileWriteOptions): Promise<void> {
        await this.delCache(false, resource.parent);
        await super.writeFile(resource, content, opts);
        this.emitter.fire([{ type: FileChangeType.UPDATED, resource }]);
    }

    async delete(resource: URI, opts: FileDeleteOptions): Promise<void> {
        await this.delCache(true, resource, resource.parent);
        await super.delete(resource, opts);
        this.emitter.fire([{ type: FileChangeType.DELETED, resource }]);
    }

    async mkdir(resource: URI): Promise<void> {
        await this.delCache(false, resource.parent);
        await super.mkdir(resource);
        this.emitter.fire([{ type: FileChangeType.ADDED, resource }]);
    }

    async rename(resource: URI, target: URI, opts: FileOverwriteOptions): Promise<void> {
        await this.delCache(true, resource.parent, target.parent);
        await super.rename(resource, target, opts);
        this.emitter.fire([{ type: FileChangeType.DELETED, resource }]);
        this.emitter.fire([{ type: FileChangeType.ADDED, resource: target }]);
    }

    async copy(resource: URI, target: URI, opts: FileOverwriteOptions): Promise<void> {
        await this.delCache(true, target.parent);
        await super.copy(resource, target, opts);
        this.emitter.fire([{ type: FileChangeType.ADDED, resource: target }]);
    }

    async updateFile(resource: URI, changes: TextDocumentContentChangeEvent[], opts: FileUpdateOptions): Promise<FileUpdateResult> {
        await this.delCache(false, resource);
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
