import { Component, ApplicationError } from '@malagu/core';
import { ErrorConverter } from '@malagu/rpc';
import { RemoteFileSystemServer } from '@theia/filesystem/lib/common/remote-file-system-provider';
import { FileSystemProviderError, FileSystemProviderErrorCode } from '@theia/filesystem/lib/common/files';

export const RemoteFileSystemProviderError = ApplicationError.declare(-33005,
    (message: string, data: { code: FileSystemProviderErrorCode, name: string }, stack: string) =>
        ({ message, data, stack })
);

@Component({ id: ErrorConverter, name: RemoteFileSystemServer })
export class FileSystemProviderErrorConverter implements ErrorConverter {

    serialize(e: any) {
        if (e instanceof FileSystemProviderError) {
            const { code, name } = e;
            return RemoteFileSystemProviderError(e.message, { code, name }, e.stack);
        }
    }

    deserialize(e: any) {
        if (RemoteFileSystemProviderError.is(e)) {
            const fileOperationError = new FileSystemProviderError(e.message, e.data.code);
            fileOperationError.name = e.data.name;
            fileOperationError.stack = e.stack;
            return fileOperationError;
        }
    }
}
