import {Entity, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {

    @PrimaryColumn({ length: 64 })
    id: string;

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
    createdAt: Date;

    @Column()
    updatedAt: Date;

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
