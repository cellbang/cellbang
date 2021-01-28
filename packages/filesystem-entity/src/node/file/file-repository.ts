import { Component, Autowired, Value, Logger, TenantProvider } from '@malagu/core';
import { ObjectStorageService, RawCloudService } from '@malagu/cloud';
import { FileRepository } from './file-protocol';
import { Transactional, OrmContext } from '@malagu/typeorm/lib/node';
import { FileStat } from '../entity';
import { ResourceNotFoundError, ResourceAlreadyExistsError } from '@cellbang/entity/lib/node';
import { basename } from 'path';
import { Readable } from 'stream';

@Component(FileRepository)
export class FileRepositoryImpl implements FileRepository {

    @Value('cellbang.filesystem.entity.bucket')
    protected readonly bucket: string;

    @Autowired(Logger)
    protected logger: Logger;

    @Autowired(TenantProvider)
    protected tenantProvider: TenantProvider;

    @Autowired(ObjectStorageService)
    protected readonly objectStorageService: ObjectStorageService<RawCloudService>;

    @Transactional({ readOnly: true })
    async exists(resource: string, tenant?: string): Promise<boolean> {
        tenant = await this.tenantProvider.provide(tenant);
        const repo = OrmContext.getRepository(FileStat);
        return await repo.createQueryBuilder()
            .where('resource = :resource and tenant = :tenant', { resource, tenant })
            .getCount() > 0;
    }

    @Transactional({ readOnly: true })
    async stat(resource: string, tenant?: string): Promise<FileStat> {
        tenant = await this.tenantProvider.provide(tenant);
        const repo = OrmContext.getRepository(FileStat);
        const stat = await repo.createQueryBuilder()
            .where('resource = :resource and tenant = :tenant', { resource, tenant })
            .getOne();
        if (stat) {
            return stat;
        }
        throw new ResourceNotFoundError(resource);

    }

    @Transactional({ readOnly: true })
    async readdir(resource: string, tenant?: string): Promise<FileStat[]> {
        tenant = await this.tenantProvider.provide(tenant);
        const stat = await this.stat(resource, tenant);
        const repo = OrmContext.getRepository(FileStat);
        const stats = await repo.createQueryBuilder()
            .where('parentId = :parentId and tenant = :tenant', { parentId: stat.id, tenant })
            .getMany();
        const map = new Map<string, FileStat>();
        for (const s of stats) {
            map.set(s.resource, s);
        }
        return Array.from(map.values());
    }

    async getFileSize(resource: string, tenant?: string): Promise<number> {
        tenant = await this.tenantProvider.provide(tenant);
        const result = await this.objectStorageService.headObject(this.getBucketAndKey(resource, tenant));
        return result.contentLength || 0;
    }

    async readFile(resource: string, tenant?: string): Promise<Uint8Array> {
        tenant = await this.tenantProvider.provide(tenant);
        return <Uint8Array> await this.objectStorageService.getObject(this.getBucketAndKey(resource, tenant));
    }

    async readFileStream(resource: string, options?: { start: number, end: number }, tenant?: string): Promise<Readable> {
        tenant = await this.tenantProvider.provide(tenant);
        return this.objectStorageService.getStream({ ...this.getBucketAndKey(resource, tenant), range: options ? `${options.start}-${options.end}` : undefined });
    }

    async writeFile(resource: string, content: Uint8Array | Readable, options?: { expires?: Date, contentLength?: number }, tenant?: string): Promise<void> {
        tenant = await this.tenantProvider.provide(tenant);
        return this.objectStorageService.putObject({ ...this.getBucketAndKey(resource, tenant), body: content, expires: options?.expires, contentLength: options?.contentLength });
    }

    @Transactional()
    async create(stat: FileStat, content?: Uint8Array): Promise<FileStat> {
        stat.tenant = await this.tenantProvider.provide(stat.tenant);
        if (await this.exists(stat.resource, stat.tenant)) {
            throw new ResourceAlreadyExistsError(stat.resource);
        }
        const repo = OrmContext.getRepository(FileStat);
        if (content && stat.isFile) {
            stat.size = content.byteLength;
            await this.writeFile(stat.resource, content, undefined, stat.tenant);
        }
        const newStat = await repo.save(stat);
        return newStat;
    }

    @Transactional()
    async update(stat: FileStat, content?: Uint8Array): Promise<FileStat> {
        const repo = OrmContext.getRepository(FileStat);
        stat.tenant = await this.tenantProvider.provide(stat.tenant);
        if (content && stat.isFile) {
            stat.size = content.byteLength;
            await this.writeFile(stat.resource, content, undefined, stat.tenant);
        }
        const newStat = await repo.save(stat);
        return newStat;
    }

    @Transactional()
    async delete(resource: string, tenant?: string): Promise<void> {
        tenant = await this.tenantProvider.provide(tenant);
        const repo = OrmContext.getRepository(FileStat);
        const where = 'resource like :resource and tenant = :tenant';
        const params = { resource: `${resource}%`, tenant };
        const stats = await repo.createQueryBuilder().where(where, params).getMany();
        await repo.createQueryBuilder().delete().where(where, params).execute();
        let keys = stats.filter(stat => stat.isFile).map(stat => this.getBucketAndKey(stat.resource, tenant!).key);
        if (!stats.length) {
            const { bucket, key } = this.getBucketAndKey(resource, tenant);
            const result = await this.objectStorageService.listObjects({ bucket, prefix: key, maxKeys: 500 });
            if (result.contents) {
                keys = result.contents.map(o => o.key);
            }
        }
        for (const key of keys) {
            try {
                await this.objectStorageService.deleteObject({ bucket: this.bucket, key });
            } catch (error) {
                this.logger.warn(error);
            }

        }

    }

    @Transactional()
    async mkdir(resource: string, tenant?: string): Promise<FileStat> {
        tenant = await this.tenantProvider.provide(tenant);
        return this.doMkdir(resource, tenant);
    }

    protected async doMkdir(resource: string , tenant: string): Promise<FileStat> {
        try {
            return await this.stat(resource, tenant);
        } catch (error) {
            if (error instanceof ResourceNotFoundError) {
                const stat = new FileStat();
                if (resource !== '/') {
                    const parent = await this.doMkdir(this.getParentDir(resource), tenant);
                    stat.parentId = parent.id;
                }
                stat.isDirectory = true;
                stat.name = basename(resource);
                stat.resource = resource;
                stat.tenant = tenant;
                return this.create(stat);
            }
            throw error;
        }

    }

    protected getParentDir(resource: string) {
        const lastIndex = resource.lastIndexOf('/');
        return resource.substr(0, lastIndex || 1);
    }

    @Transactional()
    async rename(source: string, target: string, tenant?: string): Promise<void> {
        tenant = await this.tenantProvider.provide(tenant);
        const repo = OrmContext.getRepository(FileStat);
        const parent = this.getParentDir(target);
        const parentStat = await this.stat(parent, tenant);
        const sourceStat = await this.stat(source, tenant);

        if (sourceStat.isFile) {
            await this.doRename(sourceStat, source, target, parentStat, tenant);
        } else {
            const stats = await repo.createQueryBuilder()
                .where('resource like :source and tenant = :tenant', { source: `${source}%`, tenant })
                .getMany();
            const map = stats.reduce((pre, cur) => pre.set(cur.id, cur), new Map<number, FileStat>());
            for (const stat of stats) {
                await this.doRename(stat, source, target, map.get(stat.parentId) || parentStat, tenant);
            }

        }

    }

    protected async doRename(stat: FileStat, source: string, target: String, newParentStat: FileStat, tenant: string) {
        const repo = OrmContext.getRepository(FileStat);
        const copySource = stat.resource;
        stat.resource = target + stat.resource.substring(source.length);
        stat.parentId = newParentStat.id;
        stat.name = basename(stat.resource);
        await repo.save(stat);
        if (stat.isFile) {
            await this.objectStorageService.copyObject({ ...this.getBucketAndKey(stat.resource, tenant), copySource: this.getBucketAndKey(copySource, tenant).key });
            await this.objectStorageService.deleteObject(this.getBucketAndKey(source, tenant));
        }
    }

    protected getBucketAndKey(resource: string, tenant: string) {
        return { bucket: this.bucket, key: `${tenant}${resource}` };
    }

}
