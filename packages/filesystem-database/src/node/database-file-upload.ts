import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import { NodeFileUpload } from '@theia/filesystem/lib/node/node-file-upload';
import { FileUri } from '@theia/core/lib/node/file-uri';
import { FileSystemProvider } from '@theia/filesystem/lib/common/files';
import { promisify } from 'util';

export class DatabaseFileUpload extends NodeFileUpload {

    readonly id: string;
    readonly fsPath: string;
    readonly uploadPath: string;
    protected _uploadedBytes = 0;
    get uploadedBytes(): number {
        return this._uploadedBytes;
    }

    constructor(
        readonly uri: string,
        readonly size: number,
        readonly fileSystemProvider: FileSystemProvider
    ) {
        super(uri, size);
        this.uploadPath = path.join(os.tmpdir(), this.id);
    }

    async rename(): Promise<void> {
        const content = await promisify<string, Buffer>(fs.readFile)(this.uploadPath);
        await this.fileSystemProvider.writeFile!(FileUri.create(this.fsPath), content, { overwrite: true, create: true });
    }

}
