import { Resource } from '@cellbang/entity';
import { AxiosResponse } from 'axios';
import { THEIA_EXT, VSCODE_EXT } from '@theia/workspace/lib/common';

export const X_CB_SHARE_ID = 'x-cb-share-id';
export const AUTHENTICATION_SCHEME_CB_SHARE = 'CB-Share';
export const SHARING_IS_OFF = 'Sharing is off';
export const SHARE_DOES_NOT_EXIST = 'Share does not exist';

export const ShareServer = Symbol('ShareServer');
export const ShareService = Symbol('ShareService');

export interface Share extends Resource {

    shareId: string;

    fileId: number;

    password?: string;

    permissions: string;

    disabled: boolean;

}

export interface ShareServer {
    turnOn(id: number): Promise<Share>;
    turnOff(id: number): Promise<Share | undefined>;
    resetPassword(id: number): Promise<string>;
    clearPassword(id: number): Promise<void>;
    getByResource(resource: string): Promise<Share | undefined>;
    get(shareId: string): Promise<Share | undefined>;
    create(resource: string): Promise<Share>;
    getResource(shareId: string): Promise<string | undefined>;
}

export interface ShareService {
    checkShareStatus(password?: string): Promise<AxiosResponse<string> | undefined>;
    getShareId(): string;
}

export function isWorkspaceFile(resource: string): boolean {
    return resource.endsWith(`.${THEIA_EXT}`) || resource.endsWith(`.${VSCODE_EXT}`);
}
