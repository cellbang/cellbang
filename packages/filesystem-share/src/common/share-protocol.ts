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

    resource: string;

    password?: string;

    permissions: string;

    disabled: boolean;

}

export interface ShareServer {
    turnOn(resource: string): Promise<Share>;
    turnOff(resource: string): Promise<Share | undefined>;
    resetPassword(resource: string): Promise<string>;
    clearPassword(resource: string): Promise<void>;
    getByResource(resource: string): Promise<Share | undefined>;
    get(shareId: string): Promise<Share | undefined>;
}

export interface ShareService {
    checkShareStatus(password?: string): Promise<AxiosResponse<string> | undefined>;
    getShareId(): string;
}

export function isWorkspaceFile(resource: string): boolean {
    return resource.endsWith(`.${THEIA_EXT}`) || resource.endsWith(`.${VSCODE_EXT}`);
}
