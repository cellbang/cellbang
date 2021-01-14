import {Entity, Column } from 'typeorm';
import { BaseEntity } from './base-entity';

@Entity()
export abstract class Resource extends BaseEntity {

    @Column({ length: 128 })
    tenant: string;
}
