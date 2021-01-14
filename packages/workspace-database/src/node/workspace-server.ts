import * as jsoncparser from 'jsonc-parser';
import { FileUri } from '@theia/core/lib/node';
import { Autowired } from '@malagu/core';
import { Rpc } from '@malagu/rpc';
import { WorkspaceServer } from '@theia/workspace/lib/common';
import { TenantProvider } from '@malagu/core';
import { FileRepository } from '@cellbang/filesystem-entity/lib/node';
import { WorkspaceServerImpl } from '@cellbang/workspace/lib/node';
import { EncodingService } from '@theia/core/lib/common/encoding-service';
import { BinaryBuffer } from '@theia/core/lib/common/buffer';
import { FileSystemProvider } from '@theia/filesystem/lib/common/files';

@Rpc({ id: WorkspaceServer, rebind: true })
export class DatabaseWorkspaceServer extends WorkspaceServerImpl {

    @Autowired(FileRepository)
    protected fileRepository: FileRepository;

    @Autowired(FileSystemProvider)
    protected fileSystemProvider: FileSystemProvider;

    @Autowired(TenantProvider)
    protected tenantProvider: TenantProvider;

    @Autowired(EncodingService)
    protected readonly encodingService: EncodingService;

    protected inited = false;

    protected async init(): Promise<void> {

    }

    async getMostRecentlyUsedWorkspace(): Promise<string | undefined> {
        if (!this.inited) {
            this.inited = true;
            this.root.resolve(undefined);
        }
        return this.root.promise;
    }
    async setMostRecentlyUsedWorkspace(uri: string): Promise<void> {
        this.inited = true;
        await super.setMostRecentlyUsedWorkspace(uri);
    }

    protected async exist(workspaceRootUri: string): Promise<boolean> {
        return this.fileRepository.exists(FileUri.fsPath(workspaceRootUri), await this.tenantProvider.provide());
    }

    async getRecentWorkspaces(): Promise<string[]> {
        const listUri: string[] = [];
        const data = await this.readRecentWorkspacePathsFromUserHome();
        if (data && data.recentRoots) {
            await Promise.all(data.recentRoots.map(async element => {
                if (element.length > 0) {
                    if (await this.exist(element)) {
                        listUri.push(element);
                    }
                }
            }));
        }
        return listUri;
    }

    protected async writeToFile(fsPath: string, data: object): Promise<void> {
        const encoded = this.encodingService.encode(JSON.stringify(data, undefined, 2));
        await this.fileSystemProvider.writeFile!(FileUri.create(fsPath), encoded.buffer, { overwrite: true, create: true });
    }

    protected async readJsonFromFile(fsPath: string): Promise<object | undefined> {
        if (await this.exist(fsPath)) {
            const rawContent = await this.fileRepository.readFile(fsPath, await this.tenantProvider.provide());

            const strippedContent = jsoncparser.stripComments(this.encodingService.decode(BinaryBuffer.wrap(rawContent)));
            return jsoncparser.parse(strippedContent);
        }
    }
}
