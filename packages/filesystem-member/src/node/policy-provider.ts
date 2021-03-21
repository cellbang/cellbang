import { Component, Autowired, Named } from '@malagu/core';
import { Policy } from '@malagu/security';
import { PolicyProvider, PolicyContext } from '@malagu/security/lib/node';
import { Context, AttributeScope } from '@malagu/web/lib/node';
import { SecurityContext } from '@malagu/security/lib/node';
import { CURRENT_COLLABORATION_REQUEST_KEY } from './slug-middleware';
import { isWorkspaceFile, Collaboration } from '../common';
import { PolicyUtils } from '@cellbang/filesystem-database/lib/node';
import { FileRepository, MemberRepository, FileStat, Member } from '@cellbang/filesystem-entity/lib/node';
import { EncodingService } from '@theia/core/lib/common/encoding-service';
import { EnvVariablesServer } from '@theia/core/lib/common/env-variables';
import { BinaryBuffer } from '@theia/core/lib/common/buffer';
import { FilePermission } from '@cellbang/filesystem-database/lib/node';
import { FileRole, RolePermissionMap } from '@cellbang/filesystem-database/lib/node';
import { CacheManager } from '@malagu/cache';

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

    @Autowired(CacheManager)
    @Named('filesystem-member')
    protected readonly cacheManager: CacheManager;

    async provide(ctx: PolicyContext): Promise<Policy[]> {
        const collaboration = Context.getAttr<Collaboration>(CURRENT_COLLABORATION_REQUEST_KEY, AttributeScope.Request);
        if (collaboration) {
            const stat = await this.cacheManager.wrap<FileStat>(`file:get:${collaboration.fileId}`, () => this.fileRepository.get(collaboration.fileId));
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
            let permissions: string[] = [];
            if (collaboration.tenant !== SecurityContext.getAuthentication().name) {
                const member = await this.cacheManager.wrap<Member>(`member:get:${stat.id}`, () => this.memberRepository.get(stat.id, SecurityContext.getAuthentication().name));

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

