import { Component } from '@malagu/core';
import { FileSystemWatcherClient, FileSystemWatcherServer, WatchOptions } from '@theia/filesystem/lib/common/filesystem-watcher-protocol';

@Component(FileSystemWatcherServer)
export class FileSystemWatcherServerClient implements FileSystemWatcherServer {
    watchFileChanges(uri: string, options?: WatchOptions): Promise<number> {
        return Promise.resolve(0);
    }
    unwatchFileChanges(watcher: number): Promise<void> {
        return Promise.resolve();
    }
    dispose(): void {
    }
    setClient(client: FileSystemWatcherClient | undefined): void {
    }

}
