import { Entity, Column } from 'typeorm';
import { Resource } from '@cellbang/entity/lib/node';

@Entity()
export class App extends Resource {

    @Column()
    name: string;

    @Column({ length: 64 })
    type: string;

    @Column({ length: 512, nullable: true })
    logo?: string;

    @Column({ length: 512, nullable: true })
    endpoint?: string;

    @Column({ length: 150, nullable: true })
    description?: string;

}
