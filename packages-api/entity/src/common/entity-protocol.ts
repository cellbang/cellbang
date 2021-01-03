export interface BaseEntity {
    id: number;

    createdAt: Date;

    updatedAt: Date;
}

export interface Resource extends BaseEntity {
    crn: string;
}
