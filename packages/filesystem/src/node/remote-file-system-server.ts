import { Rpc } from '@malagu/rpc';
import { FileSystemProviderServer, RemoteFileSystemServer } from '@theia/filesystem/lib/common/remote-file-system-provider';

@Rpc({ id: RemoteFileSystemServer, proxy: false })
export class FileSystemProviderServerExt extends FileSystemProviderServer {

    protected init(): void {

    }
}
