import { Share } from '../entity';

export const ShareRepository = Symbol('ShareRepository');

export interface ShareRepository {
    turnOn(id: number): Promise<Share>;
    turnOff(id: number, tenant?: string): Promise<Share | undefined>;
    setPassword(id: number, password?: string): Promise<void>;
    getById(id: number): Promise<Share>;
    getByResource(fileId: number): Promise<Share | undefined>;
    get(shareId: string): Promise<Share | undefined>;
    list(tenant?: string): Promise<Share[]>;
    create(share: Share): Promise<Share>;
}
