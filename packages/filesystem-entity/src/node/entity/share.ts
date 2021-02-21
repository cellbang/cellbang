import { Entity, Column } from 'typeorm';
import { Resource } from '@cellbang/entity/lib/node';

@Entity()
export class Share extends Resource {

    @Column({ length: 128 })
    shareId: string;

    @Column()
    fileId: number;

    @Column({ nullable: true })
    password?: string;

    @Column({ length: 1024 })
    permissions: string;

    @Column({ default: true })
    disabled: boolean;

}
