import { CollaborationServer, Collaboration } from '../common';
import { Rpc } from '@malagu/rpc';
import { Autowired } from '@malagu/core';
import { CollaborationRepository, Collaboration as CollaborationEntity, FileRepository } from '@cellbang/filesystem-entity/lib/node';
import { classToPlain } from 'class-transformer';
import { lib } from 'crypto-js';
import { AccessDecisionUtils } from '@malagu/security/lib/node';
import { FileActions, FileRole, ResourceUtils, RolePermissionMap } from '@cellbang/filesystem-database/lib/node';

@Rpc({ id: CollaborationServer, proxy: false })
export class CollaborationServerImpl implements CollaborationServer {

    @Autowired(CollaborationRepository)
    protected readonly collaborationRepository: CollaborationRepository;

    @Autowired(FileRepository)
    protected readonly fileRepository: FileRepository;

    async turnOn(id: number): Promise<Collaboration> {
        this.checkUpdatePermissions(id);
        return classToPlain(await this.collaborationRepository.turnOn(id)) as Collaboration;
    }

    async turnOff(id: number): Promise<Collaboration> {
        this.checkUpdatePermissions(id);
        return classToPlain(await this.collaborationRepository.turnOff(id)) as Collaboration;
    }

    async updateRole(id: number, role: string): Promise<Collaboration> {
        this.checkUpdatePermissions(id);
        return classToPlain(await this.collaborationRepository.updateRole(id, role)) as Collaboration;
    }

    async updateSlug(id: number, slug: string): Promise<Collaboration> {
        this.checkUpdatePermissions(id);
        return classToPlain(await this.collaborationRepository.updateSlug(id, slug)) as Collaboration;
    }

    async updateApproval(id: number, approval: boolean): Promise<Collaboration> {
        this.checkUpdatePermissions(id);
        return classToPlain(await this.collaborationRepository.updateApproval(id, approval)) as Collaboration;
    }

    async getResource(slug: string): Promise<string | undefined> {
        const collaboration = await this.getBySlug(slug);
        if (collaboration) {
            const stat = await this.fileRepository.get(collaboration.fileId);
            return stat.resource;
        }
    }

    async create(resource: string): Promise<Collaboration> {
        await AccessDecisionUtils.decide(ResourceUtils.getReource(resource), FileActions.createCollaboration);
        const stat = await this.fileRepository.stat(resource);
        const entity = new CollaborationEntity();
        entity.role = FileRole.member;
        entity.fileId = stat.id;
        entity.membersPermissions = RolePermissionMap[FileRole.member].join(',');
        entity.slug = lib.WordArray.random(3).toString();
        entity.token = lib.WordArray.random(8).toString();
        return classToPlain(await this.collaborationRepository.create(entity)) as Collaboration;
    }

    async resetToken(id: number): Promise<string> {
        this.checkUpdatePermissions(id);
        const token = lib.WordArray.random(8).toString();
        await this.collaborationRepository.updateToken(id, token);
        return token;
    }

    async getByResource(resource: string): Promise<Collaboration | undefined> {
        await AccessDecisionUtils.decide(ResourceUtils.getReource(resource), FileActions.readCollaboration);
        const stat = await this.fileRepository.stat(resource);
        const collaboration = await this.collaborationRepository.get(stat.id);
        if (collaboration) {
            return classToPlain(collaboration) as Collaboration;
        }
    }

    async getByToken(token: string): Promise<Collaboration | undefined> {
        const collaboration = await this.collaborationRepository.getByToken(token);
        if (collaboration) {
            return classToPlain(collaboration) as Collaboration;
        }
    }

    async getBySlug(slug: string): Promise<Collaboration | undefined> {
        const collaboration = await this.collaborationRepository.getBySlug(slug);
        if (collaboration) {
            return classToPlain(collaboration) as Collaboration;
        }
    }

    protected async checkUpdatePermissions(id: number) {
        const collaboration = await this.collaborationRepository.getById(id);
        const stat = await this.fileRepository.get(collaboration.fileId);
        await AccessDecisionUtils.decide(ResourceUtils.getReource(stat.resource), FileActions.updateCollaboration);
    }

}
