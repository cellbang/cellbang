import { Component, Autowired } from '@malagu/core';
import { MemberRepository } from './member-protocol';
import { Transactional, OrmContext } from '@malagu/typeorm/lib/node';
import { Member } from '../entity';
import { CollaborationRepository } from '../collaboration';
import { ResourceNotFoundError } from '@cellbang/entity/lib/node';

@Component(MemberRepository)
export class MemberRepositoryImpl implements MemberRepository {

    @Autowired(CollaborationRepository)
    protected readonly collaborationRepository: CollaborationRepository;

    @Transactional({ readOnly: true })
    async get(fileId: number, userId: string): Promise<Member | undefined> {
        const repo = OrmContext.getRepository(Member);
        return repo.createQueryBuilder()
            .where('fileId = :fileId and userId = :userId', { fileId, userId })
            .getOne();
    }

    @Transactional({ readOnly: true })
    async getById(id: number): Promise<Member> {
        const repo = OrmContext.getRepository(Member);
        const member = await repo.findOne(id);
        if (member) {
            return member;
        }
        throw new ResourceNotFoundError(id);
    }

    @Transactional({ readOnly: true })
    async list(fileId: number): Promise<Member[]> {
        const repo = OrmContext.getRepository(Member);
        return repo.createQueryBuilder()
            .where('fileId = :fileId', { fileId })
            .getMany();
    }

    @Transactional()
    async updateNickname(id: number, nickname: string): Promise<Member> {
        const repo = OrmContext.getRepository(Member);
        const member = await repo.findOneOrFail(id);
        member.nickname = nickname;
        return repo.save(member);
    }

    @Transactional()
    async updateRole(id: number, role: string): Promise<Member> {
        const repo = OrmContext.getRepository(Member);
        const member = await repo.findOneOrFail(id);
        member.role = role;
        return repo.save(member);
    }

    @Transactional()
    async approve(fileId: number, userId: string, status: string, avatar?: string, username?: string, nickname?: string): Promise<Member> {
        let member = await this.get(fileId, userId);
        if (!member) {
            const collaboration = await this.collaborationRepository.get(fileId);
            member = new Member();
            member.userId = userId;
            member.fileId = fileId;
            member.avatar = avatar!;
            member.nickname = nickname!;
            member.username = username!;
            member.role = collaboration!.role;
            member.tenant = collaboration!.tenant;
        }
        member.status = status;
        const repo = OrmContext.getRepository(Member);
        return repo.save(member);
    }

    @Transactional()
    async delete(id: number): Promise<void> {
        const repo = OrmContext.getRepository(Member);
        await repo.delete(id);
    }

}
