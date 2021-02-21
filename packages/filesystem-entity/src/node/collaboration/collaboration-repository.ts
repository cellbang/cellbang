import { Component } from '@malagu/core';
import { CollaborationRepository } from './collaboration-protocol';
import { Transactional, OrmContext } from '@malagu/typeorm/lib/node';
import { Collaboration } from '../entity';
import { Context } from '@malagu/web/lib/node';
import { ResourceNotFoundError } from '@cellbang/entity/lib/node';

@Component(CollaborationRepository)
export class CollaborationRepositoryImpl implements CollaborationRepository {

    @Transactional({ readOnly: true })
    async get(fileId: number): Promise<Collaboration | undefined> {
        const repo = OrmContext.getRepository(Collaboration);
        return repo.createQueryBuilder()
            .where('fileId = :fileId', { fileId })
            .getOne();
    }

    @Transactional({ readOnly: true })
    async getById(id: number): Promise<Collaboration> {
        const repo = OrmContext.getRepository(Collaboration);
        const collaboration = await repo.findOne(id);
        if (collaboration) {
            return collaboration;
        }
        throw new ResourceNotFoundError(id);
    }

    @Transactional({ readOnly: true })
    async getByToken(token: string): Promise<Collaboration | undefined> {
        const repo = OrmContext.getRepository(Collaboration);
        return repo.createQueryBuilder()
            .where('token = :token', { token })
            .getOne();
    }

    @Transactional({ readOnly: true })
    async getBySlug(slug: string): Promise<Collaboration | undefined> {
        const repo = OrmContext.getRepository(Collaboration);
        return repo.createQueryBuilder()
            .where('slug = :slug', { slug })
            .getOne();
    }

    @Transactional({ readOnly: true })
    async list(tenant?: string): Promise<Collaboration[]> {
        tenant = tenant || Context.getTenant();
        const repo = OrmContext.getRepository(Collaboration);
        return repo.createQueryBuilder()
            .where('tenant = :tenant', { tenant })
            .getMany();
    }

    @Transactional()
    async turnOn(id: number): Promise<Collaboration> {
        const repo = OrmContext.getRepository(Collaboration);
        const collaboration = await repo.findOneOrFail(id);
        collaboration.disabled = false;
        return repo.save(collaboration);
    }

    @Transactional()
    async turnOff(id: number): Promise<Collaboration> {
        const repo = OrmContext.getRepository(Collaboration);
        const collaboration = await repo.findOneOrFail(id);
        collaboration.disabled = true;
        return repo.save(collaboration);
    }

    @Transactional()
    async create(collaboration: Collaboration): Promise<Collaboration> {
        const repo = OrmContext.getRepository(Collaboration);
        collaboration.tenant = collaboration.tenant || Context.getTenant();
        return repo.save(collaboration);
    }

    @Transactional()
    async updateToken(id: number, token: string): Promise<Collaboration> {
        const repo = OrmContext.getRepository(Collaboration);
        const collaboration = await repo.findOneOrFail(id);
        collaboration.token = token;
        return repo.save(collaboration);
    }

    @Transactional()
    async updateSlug(id: number, slug: string): Promise<Collaboration> {
        const repo = OrmContext.getRepository(Collaboration);
        const collaboration = await repo.findOneOrFail(id);
        collaboration.slug = slug;
        return repo.save(collaboration);
    }

    @Transactional()
    async updateApproval(id: number, approval: boolean): Promise<Collaboration> {
        const repo = OrmContext.getRepository(Collaboration);
        const collaboration = await repo.findOneOrFail(id);
        collaboration.approval = approval;
        return repo.save(collaboration);
    }

    @Transactional()
    async updateRole(id: number, role: string): Promise<Collaboration> {
        const repo = OrmContext.getRepository(Collaboration);
        const collaboration = await repo.findOneOrFail(id);
        collaboration.role = role;
        return repo.save(collaboration);
    }

}
