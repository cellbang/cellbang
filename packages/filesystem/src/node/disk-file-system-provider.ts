import { Component } from '@malagu/core';
import { FileSystemProvider, FileSystemProviderCapabilities } from '@theia/filesystem/lib/common/files';
import { DiskFileSystemProvider } from '@theia/filesystem/lib/node/disk-file-system-provider';
import { OS } from '@theia/core/lib/common/os';

@Component(FileSystemProvider)
export class DiskFileSystemProviderExt extends DiskFileSystemProvider {

    get capabilities(): FileSystemProviderCapabilities {
        if (!this._capabilities) {
            this._capabilities =
                FileSystemProviderCapabilities.FileReadWrite |
                FileSystemProviderCapabilities.FileFolderCopy |
                FileSystemProviderCapabilities.Access |
                FileSystemProviderCapabilities.Trash |
                FileSystemProviderCapabilities.Update;

            if (OS.type() === OS.Type.Linux) {
                this._capabilities |= FileSystemProviderCapabilities.PathCaseSensitive;
            }
        }

        return this._capabilities;
    }

}
