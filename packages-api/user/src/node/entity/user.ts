import {Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '@cellbang/entity/lib/node';

@Entity()
export class User extends BaseEntity {

    @Column({ length: 256})
    email: string;

    @Column()
    emailVerified: boolean;

    @Column({ length: 64 })
    username?: string;

    @Column({ length: 64 })
    phoneNumber?: string;

    @Column()
    phoneVerified: boolean;

    @Column()
    appMetadata: { [key: string]: any };

    @Column()
    userMetadata: { [key: string]: any };

    @Column({ length: 512 })
    picture: string;

    @Column({ length: 64 })
    nickname: string;

    @Column()
    multifactor: string[];

    @Column({ length: 32 })
    lastIp?: string;

    @Column()
    lastLogin?: Date;

    @Column()
    loginsCount: number;

    @Column()
    blocked: boolean;

    @Column({ length: 256 })
    @Exclude()
    password?: string;
}
