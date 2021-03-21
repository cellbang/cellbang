import { Component } from '@malagu/core';
import { ShareRepository } from './share-protocol';
import { Transactional, OrmContext } from '@malagu/typeorm/lib/node';
import { Share } from '../entity';
import { Context } from '@malagu/web/lib/node';
import { ResourceNotFoundError } from '@cellbang/entity/lib/node';

@Component(ShareRepository)
export class ShareRepositoryImpl implements ShareRepository {

    @Transactional({ readOnly: true })
    async getByResource(fileId: number): Promise<Share | undefined> {
        const repo = OrmContext.getRepository(Share);
        return repo.createQueryBuilder()
            .where('fileId = :fileId', { fileId })
            .getOne();
    }

    @Transactional({ readOnly: true })
    async get(shareId: string): Promise<Share | undefined> {
        const repo = OrmContext.getRepository(Share);
        return repo.createQueryBuilder()
            .where('shareId = :shareId', { shareId })
            .getOne();
    }

    @Transactional({ readOnly: true })
    async getById(id: number): Promise<Share> {
        const repo = OrmContext.getRepository(Share);
        const share = await repo.findOne(id);
        if (share) {
            return share;
        }
        throw new ResourceNotFoundError(id);
    }

    @Transactional({ readOnly: true })
    async list(tenant?: string): Promise<Share[]> {
        tenant = tenant || Context.getTenant();
        const repo = OrmContext.getRepository(Share);
        return repo.createQueryBuilder()
            .where('tenant = :tenant', { tenant })
            .getMany();
    }

    @Transactional()
    async turnOn(id: number): Promise<Share> {
        const repo = OrmContext.getRepository(Share);
        const share = await this.getById(id);
        share.disabled = false;
        return repo.save(share);
    }

    @Transactional()
    async turnOff(id: number): Promise<Share> {
        const repo = OrmContext.getRepository(Share);
        const share = await this.getById(id);
        share.disabled = true;
        return repo.save(share);
    }

    @Transactional()
    async create(share: Share): Promise<Share> {
        const repo = OrmContext.getRepository(Share);
        share.tenant = share.tenant || Context.getTenant();
        return repo.save(share);
    }

    @Transactional()
    async setPassword(id: number, password?: string): Promise<void> {
        const repo = OrmContext.getRepository(Share);
        const share = await this.getById(id);
        // eslint-disable-next-line no-null/no-null
        (share as any).password = password ? password : null;
        await repo.save(share);
    }

}
