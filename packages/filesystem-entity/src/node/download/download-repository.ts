import { Component } from '@malagu/core';
import { DownloadRepository } from './download-protocol';
import { Transactional, OrmContext } from '@malagu/typeorm/lib/node';
import { DownloadStorageItem } from '../entity';
import { Context } from '@malagu/web/lib/node';

@Component(DownloadRepository)
export class DownloadRepositoryImpl implements DownloadRepository {

    @Transactional({ readOnly: true })
    async get(downloadId: string): Promise<DownloadStorageItem | undefined> {
        const repo = OrmContext.getRepository(DownloadStorageItem);
        return repo.createQueryBuilder()
            .where('downloadId = :downloadId', { downloadId })
            .getOne();
    }

    @Transactional({ readOnly: true })
    async list(tenant?: string): Promise<DownloadStorageItem[]> {
        tenant = tenant || Context.getTenant();
        const repo = OrmContext.getRepository(DownloadStorageItem);
        return repo.createQueryBuilder()
            .where('tenant = :tenant', { tenant })
            .getMany();
    }

    @Transactional()
    async create(downloadStorageItem: DownloadStorageItem): Promise<DownloadStorageItem> {
        downloadStorageItem.tenant = downloadStorageItem.tenant || Context.getTenant();
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
