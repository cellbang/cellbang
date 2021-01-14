import { Component, Autowired } from '@malagu/core';
import { NodeFileUpload } from '@theia/filesystem/lib/node/node-file-upload';
import { FileSystemProvider } from '@theia/filesystem/lib/common/files';
import { DatabaseFileUpload } from './database-file-upload';
import { FileUploadFactory } from '@cellbang/filesystem/lib/node';

@Component({ id: FileUploadFactory, rebind: true })
export class DatabaseFileUploadFactory implements FileUploadFactory {

    @Autowired(FileSystemProvider)
    protected readonly fileSystemProvider: FileSystemProvider;

    async create(uri: string, size: number): Promise<NodeFileUpload> {
        return new DatabaseFileUpload(uri, size, this.fileSystemProvider);
    }

}
