import { Share } from '../entity';

export const ShareRepository = Symbol('ShareRepository');

export interface ShareRepository {
    turnOn(resource: string, tenant?: string): Promise<Share>;
    turnOff(resource: string, tenant?: string): Promise<Share | undefined>;
    setPassword(resource: string, password?: string, tenant?: string): Promise<void>;
    getByResource(resource: string, tenant?: string): Promise<Share | undefined>;
    get(shareId: string): Promise<Share | undefined>;
    list(tenant?: string): Promise<Share[]>;

}
