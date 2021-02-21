import { Resource } from '@cellbang/entity';
import { THEIA_EXT, VSCODE_EXT } from '@theia/workspace/lib/common';

export const X_CB_SLUG = 'x-cb-slug';
export const COLLABORATION_IS_OFF = 'Collaboration is off';
export const COLLABORATION_DOES_NOT_EXIST = 'Collaboration does not exist';

export const CollaborationServer = Symbol('CollaborationServer');
export const CollaborationService = Symbol('CollaborationService');

export interface Collaboration extends Resource {

    slug: string;

    fileId: number;

    token: string;

    role: string;

    membersPermissions: string;

    disabled: boolean;

    approval: boolean;

}

export interface CollaborationServer {
    turnOn(id: number): Promise<Collaboration>;
    turnOff(id: number): Promise<Collaboration>;
    updateSlug(id: number, slug: string): Promise<Collaboration>;
    updateApproval(id: number, approval: boolean): Promise<Collaboration>;
    updateRole(id: number, role: string): Promise<Collaboration>;
    create(resource: string): Promise<Collaboration>;
    resetToken(id: number): Promise<string>;
    getByResource(resource: string): Promise<Collaboration | undefined>;
    getByToken(token: string): Promise<Collaboration | undefined>;
    getBySlug(slug: string): Promise<Collaboration | undefined>;
    getResource(token: string): Promise<string | undefined>;

}

export interface CollaborationService {
    getCollaborationId(): string;
}

export function isWorkspaceFile(resource: string): boolean {
    return resource.endsWith(`.${THEIA_EXT}`) || resource.endsWith(`.${VSCODE_EXT}`);
}
