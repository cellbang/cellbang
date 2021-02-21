import { Entity, Column } from 'typeorm';
import { Resource } from '@cellbang/entity/lib/node';

@Entity()
export class Member extends Resource {

    @Column()
    fileId: number;

    @Column()
    role: string;

    @Column()
    userId: string;

    @Column({ length: 1024 })
    avatar: string;

    @Column()
    username: string;

    @Column()
    nickname: string;

    @Column()
    status: string;

}
