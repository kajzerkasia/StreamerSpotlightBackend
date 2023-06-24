export interface StreamerEntity {
    id: string;
    name: string;
    platform: string;
    createdAt?: Date;
}

export enum Status {
    Add = 'Add',
    Save = 'Save'
}