import {VoteEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {v4 as uuid} from 'uuid';
import {FieldPacket} from "mysql2";

type VoteRecordResults = [VoteEntity[], FieldPacket[]];

export class VoteRecord implements VoteEntity {

    public id: string;
    public upvotes: number;
    public downvotes: number;
    public streamerId: string;

    constructor(obj: VoteEntity) {
        if (obj.upvotes > 11 || obj.downvotes > 11) {
            throw new ValidationError('Count of the votes is too large.');
        }

        this.id = obj.id;
        this.streamerId = obj.streamerId;
        this.upvotes = obj.upvotes;
        this.downvotes = obj.downvotes;
    }

    static async getOne(id: string): Promise<VoteRecord | null> {
        const [results] = await pool.execute("SELECT * from `votes` WHERE `id` = :id", {
            id,
        }) as VoteRecordResults;
        return results.length === 0 ? null : new VoteRecord(results[0]);
    }

    async insert(): Promise<string> {

        if (!this.id) {
            this.id = uuid();
        } else {
            throw new Error('Nie można dodać czegoś, co już istnieje.');
        }
        await pool.execute("INSERT INTO `votes`(`id`, `streamerId`, `upvotes`, `downvotes`) VALUES(:id, :streamerId, :upvotes, :downvotes)", this);
        return this.id;
    }

    static async getOneByStreamerId(streamerId: string): Promise<VoteRecord | null> {
        const [results] = await pool.execute("SELECT * FROM `votes` WHERE `streamerId` = :streamerId", {
            streamerId,
        }) as VoteRecordResults;

        return results.length === 0 ? null : new VoteRecord(results[0]);
    }

    async update() {

        await pool.execute("UPDATE `votes` SET `upvotes` = :upvotes, `downvotes` = :downvotes WHERE `id` = :id", {
            id: this.id,
            upvotes: this.upvotes,
            downvotes: this.downvotes,
            streamerId: this.streamerId,
        });
    }
}