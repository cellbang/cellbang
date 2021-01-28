import { Component, Autowired, TenantProvider } from '@malagu/core';
import { ShareRepository } from './share-protocol';
import { Transactional, OrmContext } from '@malagu/typeorm/lib/node';
import { Share } from '../entity';
import { v4 } from 'uuid';

@Component(ShareRepository)
export class ShareRepositoryImpl implements ShareRepository {

    @Autowired(TenantProvider)
    protected tenantProvider: TenantProvider;

    @Transactional({ readOnly: true })
    async getByResource(resource: string, tenant?: string): Promise<Share | undefined> {
        tenant = await this.tenantProvider.provide(tenant);
        const repo = OrmContext.getRepository(Share);
        return repo.createQueryBuilder()
            .where('tenant = :tenant and resource = :resource', { tenant, resource })
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
    async list(tenant?: string): Promise<Share[]> {
        tenant = await this.tenantProvider.provide(tenant);
        const repo = OrmContext.getRepository(Share);
        return repo.createQueryBuilder()
            .where('tenant = :tenant', { tenant })
            .getMany();
    }

    @Transactional()
    async turnOn(resource: string, tenant?: string): Promise<Share> {
        const repo = OrmContext.getRepository(Share);
        tenant = await this.tenantProvider.provide(tenant);
        let share = await this.getByResource(resource, tenant);
        if (share) {
            share.disabled = false;
        } else {
            share = new Share();
            share.shareId = v4();
            share.permissions = 'read';
            share.resource = resource;
            share.tenant = tenant;
            share.disabled = false;
        }
        share = await repo.save(share);
        return share;
    }

    @Transactional()
    async turnOff(resource: string, tenant?: string): Promise<Share | undefined> {
        const repo = OrmContext.getRepository(Share);
        tenant = await this.tenantProvider.provide(tenant);
        const share = await this.getByResource(resource, tenant);
        if (share) {
            share.disabled = true;
            return repo.save(share);
        }
    }

    @Transactional()
    async setPassword(resource: string, password?: string, tenant?: string): Promise<void> {
        const repo = OrmContext.getRepository(Share);
        tenant = await this.tenantProvider.provide(tenant);
        const share = await this.getByResource(resource, tenant);
        if (share) {
            // eslint-disable-next-line no-null/no-null
            (share as any).password = password ? password : null;
            await repo.save(share);
        }
    }

}
