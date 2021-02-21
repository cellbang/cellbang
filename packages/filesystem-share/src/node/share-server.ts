import { Share, ShareServer } from '../common';
import { Rpc } from '@malagu/rpc';
import { Autowired } from '@malagu/core';
import { FileRepository, ShareRepository } from '@cellbang/filesystem-entity/lib/node';
import { classToPlain } from 'class-transformer';
import { lib } from 'crypto-js';
import { Share as ShareEntity } from '@cellbang/filesystem-entity/lib/node';
import { v4 } from 'uuid';
import { AccessDecisionUtils } from '@malagu/security/lib/node';
import { FileActions, ResourceUtils, FilePermission } from '@cellbang/filesystem-database/lib/node';

@Rpc({ id: ShareServer, proxy: false })
export class ShareServerImpl implements ShareServer {

    @Autowired(ShareRepository)
    protected readonly shareRepository: ShareRepository;

    @Autowired(FileRepository)
    protected readonly fileRepository: FileRepository;

    async turnOn(id: number): Promise<Share> {
        await this.checkUpdatePermissions(id);
        return classToPlain(await this.shareRepository.turnOn(id)) as Share;
    }

    async turnOff(id: number): Promise<Share | undefined> {
        await this.checkUpdatePermissions(id);
        const share = await this.shareRepository.turnOff(id);
        if (share) {
            return classToPlain(share) as Share;
        }
    }

    async create(resource: string): Promise<Share> {
        await AccessDecisionUtils.decide(ResourceUtils.getReource(resource), FileActions.createShare);
        const stat = await this.fileRepository.stat(resource);
        const share = new ShareEntity();
        share.shareId = v4();
        share.permissions = FilePermission.read;
        share.fileId = stat.id;
        share.disabled = false;
        return classToPlain(await this.shareRepository.create(share)) as Share;
    }

    async resetPassword(id: number): Promise<string> {
        await this.checkUpdatePermissions(id);
        const password = lib.WordArray.random(2).toString();
        await this.shareRepository.setPassword(id, password);
        return password;
    }

    async clearPassword(id: number): Promise<void> {
        await this.checkUpdatePermissions(id);
        return this.shareRepository.setPassword(id);
    }

    async getByResource(resource: string): Promise<Share | undefined> {
        await AccessDecisionUtils.decide(ResourceUtils.getReource(resource), FileActions.readShare);
        const stat = await this.fileRepository.stat(resource);
        const share = await this.shareRepository.getByResource(stat.id);
        if (share) {
            return classToPlain(share) as Share;
        }
    }

    async get(shareId: string): Promise<Share | undefined> {
        const share = await this.shareRepository.get(shareId);
        if (share) {
            return classToPlain(share) as Share;
        }
    }

    async getResource(shareId: string): Promise<string | undefined> {
        const share = await this.get(shareId);
        if (share) {
            const stat = await this.fileRepository.get(share.fileId);
            return stat.resource;
        }
    }

    protected async checkUpdatePermissions(id: number) {
        const share = await this.shareRepository.getById(id);
        const stat = await this.fileRepository.get(share.fileId);
        await AccessDecisionUtils.decide(ResourceUtils.getReource(stat.resource), FileActions.updateShare);
    }

}
