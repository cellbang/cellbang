import { Rpc } from '@malagu/rpc';
import type { TextDocumentContentChangeEvent } from 'vscode-languageserver-protocol';
import { FileDeleteOptions, FileOverwriteOptions, FileUpdateOptions, FileUpdateResult, FileWriteOptions } from '@theia/filesystem/lib/common/files';
import { FileSystemProviderServer, RemoteFileSystemServer } from '@theia/filesystem/lib/common/remote-file-system-provider';

@Rpc(RemoteFileSystemServer)
export class FileSystemProviderServerExt extends FileSystemProviderServer {

    protected init(): void {

    }

    write(fd: number, pos: number, data: number[], offset: number, length: number): Promise<number> {
        return super.write(fd, pos, data, offset, length);
    }

    writeFile(resource: string, content: number[], opts: FileWriteOptions): Promise<void> {
        return super.writeFile(resource, content, opts);
    }

    delete(resource: string, opts: FileDeleteOptions): Promise<void> {
        return super.delete(resource, opts);
    }

    mkdir(resource: string): Promise<void> {
        return super.mkdir(resource);
    }

    rename(source: string, target: string, opts: FileOverwriteOptions): Promise<void> {
        return super.rename(source, target, opts);
    }

    copy(source: string, target: string, opts: FileOverwriteOptions): Promise<void> {
        return super.copy(source, target, opts);
    }

    updateFile(resource: string, changes: TextDocumentContentChangeEvent[], opts: FileUpdateOptions): Promise<FileUpdateResult> {
        return super.updateFile(resource, changes, opts);
    }

}
