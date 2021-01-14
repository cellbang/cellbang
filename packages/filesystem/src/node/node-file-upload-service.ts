// tslint:disable-next-line
import { NodeFileUpload } from '@theia/filesystem/lib/node/node-file-upload';
import { Controller, Post, Body, Query } from '@malagu/mvc/lib/node';
import { Autowired } from '@malagu/core';
import { FileUploadFactory } from './file-upload-factory';

@Controller('file-upload')
export class NodeFileUploadService {

    @Autowired(FileUploadFactory)
    protected readonly fileUploadFactory: FileUploadFactory;

    protected readonly uploadMap = new Map<string, NodeFileUpload>();

    @Post()
    async handleFileUpload(@Body() data: any, @Query('id') id: string) {
        let done = 0;
        let upload = this.uploadMap.get(id);
        const commitUpload = async () => {
            if (!upload) {
                return;
            }
            await upload.rename();
            const { uri } = upload;
            upload.dispose();
            this.uploadMap.delete(id);
            return { uri, done };
        };
        try {
            if (upload) {
                await upload.append(data as ArrayBuffer);
                done = (data as ArrayBuffer).byteLength;
                if (upload.uploadedBytes >= upload.size) {
                    return await commitUpload();
                }
                return { done };
            }
            const request = data;
            if (request.ok) {
                this.uploadMap.delete(id);
                return { ok: true };
            }
            if (request.uri) {
                upload = await this.fileUploadFactory.create(request.uri, request.size);
                await upload.create();
                this.uploadMap.set(id, upload);
                if (!upload.size) {
                    return await commitUpload();
                }
                return {};
            }
            console.error('unknown upload request', data);
            throw new Error('unknown upload request, see backend logs');
        } catch (e) {
            console.error(e);
            if (upload) {
                upload.dispose();
            }
            return {
                error: 'upload failed (see backend logs for details), reason: ' + e.message
            };
        }
    }
}
