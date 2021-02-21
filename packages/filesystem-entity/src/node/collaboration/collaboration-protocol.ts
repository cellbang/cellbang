import { Collaboration } from '../entity';

export const CollaborationRepository = Symbol('CollaborationRepository');

export interface CollaborationRepository {
    turnOn(id: number): Promise<Collaboration>;
    turnOff(id: number): Promise<Collaboration>;
    updateToken(id: number, token: string): Promise<Collaboration>;
    updateSlug(id: number, slug: string): Promise<Collaboration>;
    updateApproval(id: number, approval: boolean): Promise<Collaboration>;
    updateRole(id: number, role: string): Promise<Collaboration>;
    get(fileId: number): Promise<Collaboration | undefined>;
    getById(id: number): Promise<Collaboration>;
    getBySlug(slug: string): Promise<Collaboration | undefined>;
    getByToken(token: string): Promise<Collaboration | undefined>;
    list(tenant?: string): Promise<Collaboration[]>;
    create(collaboration: Collaboration): Promise<Collaboration>;

}
