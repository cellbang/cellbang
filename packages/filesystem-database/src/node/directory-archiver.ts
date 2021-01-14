import URI from '@theia/core/lib/common/uri';
import { FileUri } from '@theia/core/lib/node/file-uri';
import { DirectoryArchiver } from '@theia/filesystem/lib/node/download/directory-archiver';
import { Component, Autowired, TenantProvider } from '@malagu/core';
import { FileRepository, FileStat } from '@cellbang/filesystem-entity/lib/node';
import path = require('path');
import * as tar from 'tar-stream';
import { ResourceNotFoundError } from '@cellbang/entity/lib/node';
const pump = require('pump');

@Component({ id: DirectoryArchiver, rebind: true })
export class DirectoryArchiverExt extends DirectoryArchiver {

    @Autowired(FileRepository)
    protected readonly fileRepository: FileRepository;

    @Autowired(TenantProvider)
    protected tenantProvider: TenantProvider;

    protected getTenant() {
        return this.tenantProvider.provide();
    }

    protected doArchive(cwd: string, entries?: string[]) {
        const queue = entries || ['.'];
        const tarPack = tar.pack();

        const loop = async (e?: Error) => {
            if (e) {
                tarPack.destroy(e);
            }
            if (!queue.length) {
                tarPack.finalize();
                return;
            }
            const next = queue.shift()!;
            const nextAbs = path.join(cwd, next);
            let stat: FileStat;
            try {
                stat = await this.fileRepository.stat(nextAbs, await this.getTenant());
            } catch (error) {
                if (error instanceof ResourceNotFoundError) {
                    try {
                        stat = new FileStat();
                        stat.size = await this.fileRepository.getFileSize(nextAbs, await this.getTenant());
                        stat.createdAt = new Date();
                        stat.updatedAt = new Date();
                        stat.isDirectory = false;
                        stat.isFile = true;
                    } catch (error2) {
                        tarPack.destroy(error);
                        throw error;
                    }
                } else {
                    tarPack.destroy(error);
                    throw error;
                }
            }
            const header: tar.Headers = {
                name: next,
                mode: stat.isDirectory ? parseInt('555', 8) | parseInt('333', 8) : parseInt('444', 8) | parseInt('222', 8),
                mtime: stat.updatedAt,
                size: stat.size,
                type: 'file'
            };

            if (stat.isDirectory) {
                header.size = 0;
                header.type = 'directory';
                try {
                    const files = await this.fileRepository.readdir(nextAbs, await this.getTenant());
                    for (const file of files) {
                        queue.push(path.join(next, file.name));
                    }
                } catch (error) {
                    tarPack.destroy(error);
                    throw error;
                }
                tarPack.entry(header, loop);
                return;

            } else if (stat.isFile) {
                const entry = tarPack.entry(header, loop);
                if (entry) {
                    try {
                        const rs = await this.fileRepository.readFileStream(nextAbs, await this.getTenant());
                        rs.on('error', function (err: any) { // always forward errors on destroy
                            entry.destroy(err);
                        });
                        pump(rs, entry);
                    } catch (error) {
                        tarPack.destroy(error);
                        throw error;
                    }
                }
                return;
            }
            loop();
        };

        loop();
        return tarPack;

    }

    async archive(inputPath: string, outputPath: string, entries?: string[]): Promise<void> {
        const tarPack = this.doArchive(inputPath, entries);
        await this.fileRepository.writeFile(outputPath, await this.getTenant(), tarPack, { expires: new Date(Date.now() + 800000) });
    }

    protected async isDir(uri: URI): Promise<boolean> {
        try {
            const stat = await this.fileRepository.stat(FileUri.fsPath(uri), await this.getTenant());
            return stat.isDirectory;
        } catch {
            return false;
        }
    }

}
