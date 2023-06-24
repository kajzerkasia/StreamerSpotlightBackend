export interface StreamerEntity {
    id: string;
    name: string;
    streamerDescription: string;
    platform: string;
    platformDescription: string;
    createdAt?: Date;
}

export enum Status {
    Add = 'Add',
    Save = 'Save'
}