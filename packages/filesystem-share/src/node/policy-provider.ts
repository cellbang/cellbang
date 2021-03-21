import { Component, Autowired, Named } from '@malagu/core';
import { Policy } from '@malagu/security';
import { PolicyProvider, PolicyContext } from '@malagu/security/lib/node';
import { Context, AttributeScope } from '@malagu/web/lib/node';
import { CURRENT_SHARE_REQUEST_KEY } from './share-middleware';
import { isWorkspaceFile, Share } from '../common';
import { PolicyUtils } from '@cellbang/filesystem-database/lib/node';
import { FileRepository, FileStat } from '@cellbang/filesystem-entity/lib/node';
import { EncodingService } from '@theia/core/lib/common/encoding-service';
import { EnvVariablesServer } from '@theia/core/lib/common/env-variables';
import { BinaryBuffer } from '@theia/core/lib/common/buffer';
import { FilePermission } from '@cellbang/filesystem-database/lib/node';
import { CacheManager } from '@malagu/cache';

@Component(PolicyProvider)
export class SharePolicyProvider implements PolicyProvider {

    @Autowired(FileRepository)
    protected readonly fileRepository: FileRepository;

    @Autowired(EncodingService)
    protected readonly encodingService: EncodingService;

    @Autowired(EnvVariablesServer)
    protected readonly envVariablesServer: EnvVariablesServer;

    @Autowired(CacheManager)
    @Named('filesystem-share')
    protected readonly cacheManager: CacheManager;

    async provide(ctx: PolicyContext): Promise<Policy[]> {
        const share = Context.getAttr<Share>(CURRENT_SHARE_REQUEST_KEY, AttributeScope.Request);
        if (share) {
            const stat = await this.cacheManager.wrap<FileStat>(`file:get:${share.fileId}`, () => this.fileRepository.get(share.fileId));
            const resource: string[] = [ stat.resource ];
            if (isWorkspaceFile(stat.resource)) {
                const folders = await this.cacheManager.wrap<Uint8Array>(`file:readFile:${stat.resource}`, async () => {
                    const content = await this.fileRepository.readFile(stat.resource);
                    const decoded = this.encodingService.decode(BinaryBuffer.wrap(content), 'utf8');
                    return JSON.parse(decoded).folders;

                });
                resource.push(...folders);
            }
            const configDirUri = await this.envVariablesServer.getConfigDirUri();
            resource.push(`${configDirUri}`);

            return [ await PolicyUtils.getPolicy(resource.map(r => `${r}*`), FilePermission.read) ];
        }
        return [];
    }
}

