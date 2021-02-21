import { MemberServer, Member, MemberStatus } from '../common';
import { Rpc } from '@malagu/rpc';
import { Autowired } from '@malagu/core';
import { SecurityContext, AccessDecisionUtils } from '@malagu/security/lib/node';
import { MemberRepository, FileRepository } from '@cellbang/filesystem-entity/lib/node';
import { classToPlain } from 'class-transformer';
import { FileActions, ResourceUtils } from '@cellbang/filesystem-database/lib/node';

@Rpc({ id: MemberServer, proxy: false })
export class MemberServerImpl implements MemberServer {

    @Autowired(MemberRepository)
    protected readonly memberRepository: MemberRepository;

    @Autowired(FileRepository)
    protected readonly fileRepository: FileRepository;

    async list(resource: string): Promise<Member[]> {
        await AccessDecisionUtils.decide(ResourceUtils.getReource(resource), FileActions.listMember);
        const stat = await this.fileRepository.stat(resource);
        const members = await this.memberRepository.list(stat.id);
        return members.map(m => classToPlain(m) as Member);
    }

    async agree(fileId: number, userId: string): Promise<Member> {
        const stat = await this.fileRepository.get(fileId);
        await AccessDecisionUtils.decide(ResourceUtils.getReource(stat.resource), FileActions.updateMember);
        const { avatar, nickname, login } = this.getUserInfo();
        return classToPlain(await this.memberRepository.approve(fileId, userId, MemberStatus.applied, avatar, login, nickname)) as Member;
    }

    async apply(fileId: number): Promise<Member> {
        const stat = await this.fileRepository.get(fileId);
        await AccessDecisionUtils.decide(ResourceUtils.getReource(stat.resource), FileActions.updateMember);
        const { avatar, nickname, login } = this.getUserInfo();
        return classToPlain(await this.memberRepository.approve(fileId, SecurityContext.getAuthentication().name, MemberStatus.applying, avatar, login, nickname)) as Member;
    }

    protected getUserInfo() {
        const auth = SecurityContext.getAuthentication();
        if (auth.authenticated) {
            return SecurityContext.getAuthentication().principal;
        } else {
            return {
                nickname: auth.name,
                login: auth.name,
                avater: ''
            };
        }

    }

    async get(fileId: number, userId: string): Promise<Member | undefined> {
        const member = await this.memberRepository.get(fileId, userId);
        if (member) {
            return classToPlain(member) as Member;
        }
    }

    async updateNickname(id: number, nickname: string): Promise<Member> {
        const member = await this.memberRepository.getById(id);
        const stat = await this.fileRepository.get(member.fileId);
        await AccessDecisionUtils.decide(ResourceUtils.getReource(stat.resource), FileActions.updateMember);
        return classToPlain(await this.memberRepository.updateNickname(id, nickname)) as Member;
    }

    async updateRole(id: number, role: string): Promise<Member> {
        const member = await this.memberRepository.getById(id);
        const stat = await this.fileRepository.get(member.fileId);
        await AccessDecisionUtils.decide(ResourceUtils.getReource(stat.resource), FileActions.updateMember);
        return classToPlain(await this.memberRepository.updateRole(id, role)) as Member;
    }

    async delete(id: number): Promise<void> {
        const member = await this.memberRepository.getById(id);
        const stat = await this.fileRepository.get(member.fileId);
        await AccessDecisionUtils.decide(ResourceUtils.getReource(stat.resource), FileActions.deleteMember);
        return this.memberRepository.delete(id);
    }

}
