import {Entity, Column } from 'typeorm';
import { BaseEntity } from './base-entity';

@Entity()
export abstract class Resouce extends BaseEntity {

    @Column({ length: 512 })
    crn: string;
}
