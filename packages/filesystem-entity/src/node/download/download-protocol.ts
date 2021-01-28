import { DownloadStorageItem } from '../entity';

export const DownloadRepository = Symbol('DownloadRepository');

export interface DownloadRepository {
    get(downloadId: string): Promise<DownloadStorageItem | undefined>;
    delete(downloadId: string): Promise<void>;
    list(tenant?: string): Promise<DownloadStorageItem[]>;
    create(downloadStorageItem: DownloadStorageItem): Promise<DownloadStorageItem>;

}
