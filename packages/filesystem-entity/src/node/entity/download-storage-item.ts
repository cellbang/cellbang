import { Entity, Column } from 'typeorm';
import { Resource } from '@cellbang/entity/lib/node';

@Entity()
export class DownloadStorageItem extends Resource {

    @Column({ length: 128 })
    downloadId: string;

    @Column({ length: 1024 })
    file: string;

    @Column({ length: 1024, nullable: true })
    root?: string;

    @Column({ default: 0 })
    size: number;

    @Column({ default: true })
    remove: boolean;

    @Column({ nullable: true })
    expire?: Date;

}

