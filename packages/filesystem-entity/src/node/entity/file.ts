import { Entity, Column } from 'typeorm';
import { Resource } from '@cellbang/entity/lib/node';

@Entity()
export class FileStat extends Resource {

    @Column({ nullable: true })
    parentId: number;

    @Column({ length: 1024 })
    resource: string;

    @Column({ length: 128 })
    name: string;

    @Column({ length: 128, default: 'Normal' })
    type: string;

    @Column({ default: 0, nullable: true })
    size: number;

    @Column({ default: false })
    isFile: boolean;

    @Column({ default: false })
    isDirectory: boolean;

}

