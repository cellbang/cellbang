import { Component, Autowired, TenantProvider } from '@malagu/core';
import { normalize, join } from 'path';
import URI from '@theia/core/lib/common/uri';
import { FileUri } from '@theia/core/lib/node/file-uri';
import { Event, Emitter } from '@theia/core/lib/common/event';
import { Disposable, DisposableCollection } from '@theia/core/lib/common/disposable';
import { OS } from '@theia/core/lib/common/os';
import {
    FileSystemProvider,
    FileSystemProviderWithFileReadWriteCapability, FileSystemProviderWithFileFolderCopyCapability,
    FileSystemProviderCapabilities,
    Stat,
    FileType,
    FileWriteOptions,
    createFileSystemProviderError,
    FileSystemProviderErrorCode,
    FileDeleteOptions,
    FileOverwriteOptions,
    FileSystemProviderError,
    FileChange,
    WatchOptions,
    FileUpdateOptions, FileUpdateResult
} from '@theia/filesystem/lib/common/files';
import { TextDocumentContentChangeEvent } from 'vscode-languageserver-protocol';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { EncodingService } from '@theia/core/lib/common/encoding-service';
import { BinaryBuffer } from '@theia/core/lib/common/buffer';
import { FileRepository, FileStat } from '@cellbang/filesystem-entity/lib/node';
import { ResourceNotFoundError } from '@cellbang/entity/lib/node';

/* eslint-disable no-null/no-null */

@Component({ id: FileSystemProvider, rebind: true })
export class DatabaseFileSystemProvider implements Disposable, FileSystemProviderWithFileReadWriteCapability, FileSystemProviderWithFileFolderCopyCapability {

    readonly onDidChangeCapabilities = Event.None;
    private readonly onDidChangeFileEmitter = new Emitter<readonly FileChange[]>();
    readonly onDidChangeFile = this.onDidChangeFileEmitter.event;

    private readonly onFileWatchErrorEmitter = new Emitter<void>();
    readonly onFileWatchError = this.onFileWatchErrorEmitter.event;

    protected readonly toDispose = new DisposableCollection(
        this.onDidChangeFileEmitter
    );

    @Autowired(FileRepository)
    protected fileRepository: FileRepository;

    @Autowired(TenantProvider)
    protected tenantProvider: TenantProvider;

    @Autowired(EncodingService)
    protected readonly encodingService: EncodingService;

    protected _capabilities: FileSystemProviderCapabilities | undefined;

    get capabilities(): FileSystemProviderCapabilities {
        if (!this._capabilities) {
            this._capabilities =
                FileSystemProviderCapabilities.FileReadWrite |
                FileSystemProviderCapabilities.FileFolderCopy |
                FileSystemProviderCapabilities.PathCaseSensitive |
                FileSystemProviderCapabilities.Access |
                FileSystemProviderCapabilities.Trash |
                FileSystemProviderCapabilities.Update;

            if (OS.type() === OS.Type.Linux) {
                this._capabilities |= FileSystemProviderCapabilities.PathCaseSensitive;
            }
        }

        return this._capabilities;
    }

    async fsPath(resource: URI): Promise<string> {
        return FileUri.fsPath(resource);
    }

    protected toFilePath(resource: URI): string {
        return normalize(FileUri.fsPath(resource));
    }

    protected getTenant() {
        return this.tenantProvider.provide();
    }

    protected toType(entry: FileStat): FileType {
        return entry.isFile ? FileType.File : FileType.Directory;
    }

    private toFileSystemProviderError(error: NodeJS.ErrnoException): FileSystemProviderError {
        if (error instanceof FileSystemProviderError) {
            return error; // avoid double conversion
        }

        if (error instanceof ResourceNotFoundError) {
            return createFileSystemProviderError(error, FileSystemProviderErrorCode.FileNotFound);
        }

        return createFileSystemProviderError(error, FileSystemProviderErrorCode.Unknown);
    }

    async stat(resource: URI): Promise<Stat> {
        try {
            const stat = await this.fileRepository.stat(this.toFilePath(resource), await this.getTenant());
            return {
                type: this.toType(stat),
                ctime: stat.createdAt.getTime(),
                mtime: stat.updatedAt.getTime(),
                size: stat.size
            };
        } catch (error) {
            if (resource.path.isRoot && error instanceof ResourceNotFoundError) {
                try {
                    const stat = await this.fileRepository.mkdir(this.toFilePath(resource), await this.getTenant());
                    return {
                        type: this.toType(stat),
                        ctime: stat.createdAt.getTime(),
                        mtime: stat.updatedAt.getTime(),
                        size: stat.size
                    };
                } catch (error2) {
                    throw this.toFileSystemProviderError(error2);
                }

            }
            throw this.toFileSystemProviderError(error);
        }
    }

    async access(resource: URI, mode?: number): Promise<void> {

    }

    async readdir(resource: URI): Promise<[string, FileType][]> {
        try {
            const children = await this.fileRepository.readdir(this.toFilePath(resource), await this.getTenant());
            return children.map(child => [child.name, this.toType(child)]);
        } catch (error) {
            throw this.toFileSystemProviderError(error);
        }
    }

    async readFile(resource: URI): Promise<Uint8Array> {
        try {
            const filePath = this.toFilePath(resource);
            return await this.fileRepository.readFile(filePath, await this.getTenant());
        } catch (error) {
            throw this.toFileSystemProviderError(error);
        }
    }

    async writeFile(resource: URI, content: Uint8Array, opts: FileWriteOptions): Promise<void> {
        try {
            const filePath = this.toFilePath(resource);
            let stat: FileStat | undefined;
            try {
                stat = await this.fileRepository.stat(filePath, await this.getTenant());
            } catch (error2) {
                if (!(error2 instanceof ResourceNotFoundError)) {
                    throw error2;
                }
            }

            // Validate target unless { create: true, overwrite: true }
            if (!opts.create || !opts.overwrite) {
                const fileExists = !!stat;
                if (fileExists) {
                    if (!opts.overwrite) {
                        throw createFileSystemProviderError('File already exists', FileSystemProviderErrorCode.FileExists);
                    }
                } else {
                    if (!opts.create) {
                        throw createFileSystemProviderError('File does not exist', FileSystemProviderErrorCode.FileNotFound);
                    } else {

                        return;
                    }
                }
            }

            if (stat) {
                await this.fileRepository.update(stat, content);
            } else {
                const parent = await this.fileRepository.mkdir(this.toFilePath(resource.parent), await this.getTenant());
                stat = new FileStat();
                stat.parentId = parent.id;
                stat.isFile = true;
                stat.name = resource.path.base;
                stat.resource = this.toFilePath(resource);
                stat.tenant = await this.getTenant();
                await this.fileRepository.create(stat, content);
            }

        } catch (error) {
            throw this.toFileSystemProviderError(error);
        }
    }

    async mkdir(resource: URI): Promise<void> {
        await this.fileRepository.mkdir(this.toFilePath(resource), await this.getTenant());
    }

    async delete(resource: URI, opts: FileDeleteOptions): Promise<void> {
        try {
            const filePath = this.toFilePath(resource);

            await this.fileRepository.delete(filePath, await this.getTenant());
        } catch (error) {
            throw this.toFileSystemProviderError(error);
        }
    }

    async rename(from: URI, to: URI, opts: FileOverwriteOptions): Promise<void> {
        const fromFilePath = this.toFilePath(from);
        const toFilePath = this.toFilePath(to);

        if (fromFilePath === toFilePath) {
            return; // simulate node.js behaviour here and do a no-op if paths match
        }

        try {

            // Ensure target does not exist
            await this.validateTargetDeleted(from, to, 'move', opts.overwrite);

            // Move
            await this.move(fromFilePath, toFilePath);
        } catch (error) {

            throw this.toFileSystemProviderError(error);
        }
    }

    protected async move(source: string, target: string): Promise<void> {
        if (source === target) {
            return Promise.resolve();
        }

        await this.fileRepository.rename(source, target, await this.getTenant());
    }

    async copy(from: URI, to: URI, opts: FileOverwriteOptions): Promise<void> {
        const fromFilePath = this.toFilePath(from);
        const toFilePath = this.toFilePath(to);

        if (fromFilePath === toFilePath) {
            return; // simulate node.js behaviour here and do a no-op if paths match
        }

        try {

            // Ensure target does not exist
            await this.validateTargetDeleted(from, to, 'copy', opts.overwrite);

            // Copy
            await this.doCopy(fromFilePath, toFilePath);
        } catch (error) {

            throw this.toFileSystemProviderError(error);
        }
    }

    protected async doCopy(source: string, target: string, copiedSourcesIn?: { [path: string]: boolean }): Promise<void> {
        const copiedSources = copiedSourcesIn ? copiedSourcesIn : Object.create(null);

        const fileStat = await this.fileRepository.stat(source, await this.getTenant());
        if (!fileStat.isDirectory) {
            return this.doCopyFile(source, target);
        }

        if (copiedSources[source]) {
            return Promise.resolve(); // escape when there are cycles (can happen with symlinks)
        }

        copiedSources[source] = true; // remember as copied

        // Create folder
        this.mkdir(new URI(target));

        // Copy each file recursively
        const files = await this.fileRepository.readdir(source, await this.getTenant());
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            await this.doCopy(join(source, file.name), join(target, file.name), copiedSources);
        }
    }

    watch(resource: URI, opts: WatchOptions): Disposable {

        return Disposable.NULL;
    }

    async updateFile(resource: URI, changes: TextDocumentContentChangeEvent[], opts: FileUpdateOptions): Promise<FileUpdateResult> {
        try {
            const content = await this.readFile(resource);
            const decoded = this.encodingService.decode(BinaryBuffer.wrap(content), opts.readEncoding);
            const newContent = TextDocument.update(TextDocument.create('', '', 1, decoded), changes, 2).getText();
            const encoding = await this.encodingService.toResourceEncoding(opts.writeEncoding, {
                overwriteEncoding: opts.overwriteEncoding,
                read: async length => {
                    if (content.length >= length) {
                        return content.slice(0, length);
                    }
                    return Buffer.from('');
                }
            });
            const encoded = this.encodingService.encode(newContent, encoding);
            await this.writeFile(resource, encoded.buffer, { create: false, overwrite: true });
            const stat = await this.stat(resource);
            return Object.assign(stat, { encoding: encoding.encoding });
        } catch (error) {
            throw this.toFileSystemProviderError(error);
        }
    }

    protected async doCopyFile(source: string, target: string): Promise<void> {
        const targetUri = new URI(target);
        const sourceStat = await this.fileRepository.stat(source, await this.getTenant());
        const parentStat = await this.fileRepository.stat(this.toFilePath(targetUri.parent), await this.getTenant());
        const content = await this.fileRepository.readFile(source, await this.getTenant());
        const stat = new FileStat();
        stat.parentId = parentStat.id;
        stat.isFile = true;
        stat.name = targetUri.path.base;
        stat.resource = target;
        stat.type = sourceStat.type;
        stat.tenant = await this.getTenant();
        await this.fileRepository.create(stat, content);
    }

    private async validateTargetDeleted(from: URI, to: URI, mode: 'move' | 'copy', overwrite?: boolean): Promise<void> {
        const isPathCaseSensitive = !!(this.capabilities & FileSystemProviderCapabilities.PathCaseSensitive);

        const fromFilePath = this.toFilePath(from);
        const toFilePath = this.toFilePath(to);

        let isSameResourceWithDifferentPathCase = false;
        if (!isPathCaseSensitive) {
            isSameResourceWithDifferentPathCase = fromFilePath.toLowerCase() === toFilePath.toLowerCase();
        }

        if (isSameResourceWithDifferentPathCase && mode === 'copy') {
            throw createFileSystemProviderError("'File cannot be copied to same path with different path case", FileSystemProviderErrorCode.FileExists);
        }

        // handle existing target (unless this is a case change)
        if (!isSameResourceWithDifferentPathCase && await this.fileRepository.exists(toFilePath, await this.getTenant())) {
            if (!overwrite) {
                throw createFileSystemProviderError('File at target already exists', FileSystemProviderErrorCode.FileExists);
            }

            // Delete target
            await this.delete(to, { recursive: true, useTrash: false });
        }
    }

    dispose(): void {
        this.toDispose.dispose();
    }
}

