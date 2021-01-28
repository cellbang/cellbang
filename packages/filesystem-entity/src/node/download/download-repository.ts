import { Component, Autowired, TenantProvider } from '@malagu/core';
import { DownloadRepository } from './download-protocol';
import { Transactional, OrmContext } from '@malagu/typeorm/lib/node';
import { DownloadStorageItem } from '../entity';

@Component(DownloadRepository)
export class DownloadRepositoryImpl implements DownloadRepository {

    @Autowired(TenantProvider)
    protected tenantProvider: TenantProvider;

    @Transactional({ readOnly: true })
    async get(downloadId: string): Promise<DownloadStorageItem | undefined> {
        const repo = OrmContext.getRepository(DownloadStorageItem);
        return repo.createQueryBuilder()
            .where('downloadId = :downloadId', { downloadId })
            .getOne();
    }

    @Transactional({ readOnly: true })
    async list(tenant?: string): Promise<DownloadStorageItem[]> {
        tenant = await this.tenantProvider.provide(tenant);
        const repo = OrmContext.getRepository(DownloadStorageItem);
        return repo.createQueryBuilder()
            .where('tenant = :tenant', { tenant })
            .getMany();
    }

    @Transactional()
    async create(downloadStorageItem: DownloadStorageItem): Promise<DownloadStorageItem> {
        downloadStorageItem.tenant = await this.tenantProvider.provide(downloadStorageItem.tenant);
        const repo = OrmContext.getRepository(DownloadStorageItem);
        const newItem = await repo.save(downloadStorageItem);
        return newItem;
    }

    @Transactional()
    async delete(downloadId: string): Promise<void> {
        const repo = OrmContext.getRepository(DownloadStorageItem);
        await repo.createQueryBuilder()
            .where('downloadId = :downloadId', { downloadId })
            .delete()
            .execute();
    }

}
