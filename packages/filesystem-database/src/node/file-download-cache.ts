import { Autowired, Component, Logger } from '@malagu/core';
import { TenantProvider } from '@malagu/core';
import { DownloadStorageItem, FileRepository, DownloadRepository } from '@cellbang/filesystem-entity/lib/node';

@Component(FileDownloadCache)
export class FileDownloadCache {

    @Autowired(Logger)
    protected readonly logger: Logger;

    protected readonly expireTimeInMinutes: number = 1;

    @Autowired(FileRepository)
    protected fileRepository: FileRepository;

    @Autowired(DownloadRepository)
    protected downloadRepository: DownloadRepository;

    @Autowired(TenantProvider)
    protected tenantProvider: TenantProvider;

    async addDownload(downloadInfo: DownloadStorageItem): Promise<void> {
        downloadInfo.file = downloadInfo.file;
        // expires in 1 minute enough for parallel connections to be connected.
        downloadInfo.expire = new Date(Date.now() + (this.expireTimeInMinutes * 6000));
        downloadInfo.tenant = await this.tenantProvider.provide();
        await this.downloadRepository.create(downloadInfo);
    }

    async getDownload(id: string): Promise<DownloadStorageItem | undefined> {
        const downloadInfo = await this.downloadRepository.get(id);
        if (downloadInfo) {
            await this.expireDownloads(downloadInfo.tenant);
        }
        return downloadInfo;
    }

    async deleteDownload(id: string): Promise<void> {
        const downloadInfo = await this.downloadRepository.get(id);
        if (downloadInfo && downloadInfo.remove) {
            await this.deleteRecursively(downloadInfo.root || downloadInfo.file, downloadInfo.tenant);
        }
        await this.downloadRepository.delete(id);
    }

    protected async deleteRecursively(pathToDelete: string, tenant: string): Promise<void> {
        await this.fileRepository.delete(pathToDelete, tenant);
    }

    protected async expireDownloads(tenant: string): Promise<void> {
        const time = Date.now();
        for (const item of await this.downloadRepository.list(tenant)) {
            if (item.expire && item.expire.getTime() <= time) {
                await this.deleteDownload(item.downloadId);
            }
        }
    }
}
