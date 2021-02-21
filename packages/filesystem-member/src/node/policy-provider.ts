import { Component, Autowired } from '@malagu/core';
import { Policy } from '@malagu/security';
import { PolicyProvider, PolicyContext } from '@malagu/security/lib/node';
import { Context, AttributeScope } from '@malagu/web/lib/node';
import { SecurityContext } from '@malagu/security/lib/node';
import { CURRENT_COLLABORATION_REQUEST_KEY } from './slug-middleware';
import { isWorkspaceFile, Collaboration } from '../common';
import { PolicyUtils } from '@cellbang/filesystem-database/lib/node';
import { FileRepository, MemberRepository } from '@cellbang/filesystem-entity/lib/node';
import { EncodingService } from '@theia/core/lib/common/encoding-service';
import { EnvVariablesServer } from '@theia/core/lib/common/env-variables';
import { BinaryBuffer } from '@theia/core/lib/common/buffer';
import { FilePermission } from '@cellbang/filesystem-database/lib/node';
import { FileRole, RolePermissionMap } from '@cellbang/filesystem-database/lib/node';

@Component(PolicyProvider)
export class MemberPolicyProvider implements PolicyProvider {

    @Autowired(FileRepository)
    protected readonly fileRepository: FileRepository;

    @Autowired(MemberRepository)
    protected readonly memberRepository: MemberRepository;

    @Autowired(EncodingService)
    protected readonly encodingService: EncodingService;

    @Autowired(EnvVariablesServer)
    protected readonly envVariablesServer: EnvVariablesServer;

    async provide(ctx: PolicyContext): Promise<Policy[]> {
        const collaboration = Context.getAttr<Collaboration>(CURRENT_COLLABORATION_REQUEST_KEY, AttributeScope.Request);
        if (collaboration) {
            const stat = await this.fileRepository.get(collaboration.fileId);
            const resource: string[] = [ stat.resource ];
            if (isWorkspaceFile(stat.resource)) {
                const content = await this.fileRepository.readFile(stat.resource);
                const decoded = this.encodingService.decode(BinaryBuffer.wrap(content), 'utf8');
                resource.push(...JSON.parse(decoded).folders);
            }
            const configDirUri = await this.envVariablesServer.getConfigDirUri();
            let permissions: string[] = [];
            if (collaboration.tenant !== SecurityContext.getAuthentication().name) {
                const member = await this.memberRepository.get(stat.id, SecurityContext.getAuthentication().name);
                if (member) {
                    if (member.role === FileRole.member) {
                        permissions = collaboration.membersPermissions.split(',');
                    } else {
                        permissions = RolePermissionMap[member.role];
                    }
                }
            }

            if (permissions.length === 0) {
                return [];
            }

            return [
                await PolicyUtils.getPolicy(`${configDirUri}*`, FilePermission.read),
                await PolicyUtils.getPolicy(resource.map(r => `${r}*`), ...permissions)
            ];
        }
        return [];
    }
}

