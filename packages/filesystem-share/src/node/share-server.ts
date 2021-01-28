import { Share, ShareServer } from '../common';
import { Rpc } from '@malagu/rpc';
import { Autowired } from '@malagu/core';
import { ShareRepository } from '@cellbang/filesystem-entity/lib/node';
import { classToPlain } from 'class-transformer';
import { lib } from 'crypto-js';

@Rpc(ShareServer)
export class ShareServerImpl implements ShareServer {

    @Autowired(ShareRepository)
    protected readonly shareRepository: ShareRepository;

    async turnOn(resource: string): Promise<Share> {
        return classToPlain(await this.shareRepository.turnOn(resource)) as Share;
    }

    async turnOff(resource: string): Promise<Share | undefined> {
        const share = await this.shareRepository.turnOff(resource);
        if (share) {
            return classToPlain(share) as Share;
        }
    }

    async resetPassword(resource: string): Promise<string> {
        const password = lib.WordArray.random(2).toString();
        await this.shareRepository.setPassword(resource, password);
        return password;
    }

    clearPassword(resource: string): Promise<void> {
        return this.shareRepository.setPassword(resource);
    }

    async getByResource(resource: string): Promise<Share | undefined> {
        const share = await this.shareRepository.getByResource(resource);
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

}
