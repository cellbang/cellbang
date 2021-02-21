import { Component, Autowired } from '@malagu/core';
import { Policy } from '@malagu/security';
import { PolicyProvider, PolicyContext } from '@malagu/security/lib/node';
import { Context, AttributeScope } from '@malagu/web/lib/node';
import { CURRENT_SHARE_REQUEST_KEY } from './share-middleware';
import { isWorkspaceFile, Share } from '../common';
import { PolicyUtils } from '@cellbang/filesystem-database/lib/node';
import { FileRepository } from '@cellbang/filesystem-entity/lib/node';
import { EncodingService } from '@theia/core/lib/common/encoding-service';
import { EnvVariablesServer } from '@theia/core/lib/common/env-variables';
import { BinaryBuffer } from '@theia/core/lib/common/buffer';
import { FilePermission } from '@cellbang/filesystem-database/lib/node';

@Component(PolicyProvider)
export class SharePolicyProvider implements PolicyProvider {

    @Autowired(FileRepository)
    protected readonly fileRepository: FileRepository;

    @Autowired(EncodingService)
    protected readonly encodingService: EncodingService;

    @Autowired(EnvVariablesServer)
    protected readonly envVariablesServer: EnvVariablesServer;

    async provide(ctx: PolicyContext): Promise<Policy[]> {
        const share = Context.getAttr<Share>(CURRENT_SHARE_REQUEST_KEY, AttributeScope.Request);
        if (share) {
            const stat = await this.fileRepository.get(share.fileId);
            const resource: string[] = [ stat.resource ];
            if (isWorkspaceFile(stat.resource)) {
                const content = await this.fileRepository.readFile(stat.resource);
                const decoded = this.encodingService.decode(BinaryBuffer.wrap(content), 'utf8');
                resource.push(...JSON.parse(decoded).folders);
            }
            const configDirUri = await this.envVariablesServer.getConfigDirUri();
            resource.push(`${configDirUri}`);

            return [ await PolicyUtils.getPolicy(resource.map(r => `${r}*`), FilePermission.read) ];
        }
        return [];
    }
}

