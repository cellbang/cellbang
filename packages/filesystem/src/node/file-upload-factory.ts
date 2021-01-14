import { Component } from '@malagu/core';
import { NodeFileUpload } from '@theia/filesystem/lib/node/node-file-upload';

export const FileUploadFactory = Symbol('FileUploadFactory');

export interface FileUploadFactory {
    create(uri: string, size: number): Promise<NodeFileUpload>
}

@Component(FileUploadFactory)
export class NodeFileUploadFactory implements FileUploadFactory  {

    async create(uri: string, size: number): Promise<NodeFileUpload> {
        return new NodeFileUpload(uri, size);
    }

}
