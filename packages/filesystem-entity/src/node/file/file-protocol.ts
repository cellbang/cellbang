import { FileStat } from '../entity';
import { Readable } from 'stream';

export const FileRepository = Symbol('FileRepository');

export interface FileRepository {
    stat(resource: string, tenant?: string): Promise<FileStat>;
    readdir(resource: string, tenant?: string): Promise<FileStat[]>;
    readFile(resource: string, tenant?: string): Promise<Uint8Array>;
    exists(resource: string, tenant?: string): Promise<boolean>;
    writeFile(resource: string, content: Uint8Array | Readable, options?: { expires?: Date, contentLength?: number }, tenant?: string): Promise<void>;
    create(stat: FileStat, content?: Uint8Array): Promise<FileStat>;
    update(stat: FileStat, content?: Uint8Array): Promise<FileStat>;
    delete(resource: string, tenant?: string): Promise<void>;
    rename(source: string, target: string, tenant?: string): Promise<void>;
    readFileStream(resource: string, options?: { start: number, end: number }, tenant?: string): Promise<Readable>;
    mkdir(resource: string, tenant?: string): Promise<FileStat>;
    getFileSize(resource: string, tenant?: string): Promise<number>;

}
