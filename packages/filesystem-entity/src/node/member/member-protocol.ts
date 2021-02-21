import { Member } from '../entity';

export const MemberRepository = Symbol('MemberRepository');

export interface MemberRepository {
    approve(fileId: number, userId: string, status: string, avatar?: string, username?: string, nickname?: string): Promise<Member>;
    get(fileId: number, userId: string): Promise<Member | undefined>;
    getById(id: number): Promise<Member>;
    updateNickname(id: number, nickname: string): Promise<Member>;
    updateRole(id: number, role: string): Promise<Member>;
    delete(id: number): Promise<void>;
    list(fileId: number): Promise<Member[]>;
}
