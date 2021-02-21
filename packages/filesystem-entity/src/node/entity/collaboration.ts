import { Entity, Column } from 'typeorm';
import { Resource } from '@cellbang/entity/lib/node';

@Entity()
export class Collaboration extends Resource {

    @Column({ length: 128, unique: true })
    slug: string;

    @Column()
    fileId: number;

    @Column({ unique: true })
    token: string;

    @Column()
    role: string;

    @Column({ length: 1024 })
    membersPermissions: string;

    @Column({ default: true })
    disabled: boolean;

    @Column({ default: true })
    approval: boolean;

}
