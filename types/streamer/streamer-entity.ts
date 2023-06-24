export interface StreamerEntity {
    id?: string;
    name: string;
    description?: string;
    platform: string;
    createdAt?: Date;
}

export enum Status {
    Add = 'Add',
    Save = 'Save',
    Delete = 'Remove',
}