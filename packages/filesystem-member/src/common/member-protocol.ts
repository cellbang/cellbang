import { Resource } from '@cellbang/entity';
import { Collaboration } from './collaboration-protocol';

export const MemberServer = Symbol('MemberServer');
export const MemberService = Symbol('MemberService');
export const InvitationMeta = Symbol('InvitationMeta');

export const X_CB_JOIN_TOKEN = 'x-cb-join-token';

export interface InvitationMeta {
    member?: Member;
    collaboration: Collaboration;
    resource: string;
    isDirectory: boolean;
}

export enum MemberStatus {
    applying = 'applying', applied = 'applied'
}

export interface Member extends Resource {

    fileId: number;

    role: string;

    userId: string;

    avatar: string;

    username: string;

    nickname: string;

    status: string;

}

export interface MemberServer {
    list(resource: string): Promise<Member[]>;
    agree(fileId: number, userId: string): Promise<Member>;
    apply(fileId: number): Promise<Member>;
    get(fileId: number, userId: string): Promise<Member | undefined>;
    updateNickname(id: number, nickname: string): Promise<Member>;
    updateRole(id: number, role: string): Promise<Member>;
    delete(id: number): Promise<void>;
}

export interface MemberService {
    getInvitationMeta(): Promise<InvitationMeta | undefined>;
    getToken(): string;
}
