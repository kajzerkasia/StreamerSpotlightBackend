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
        if (!obj.upvotes || obj.upvotes > 9 || !obj.downvotes || obj.downvotes > 9) {
            throw new ValidationError('Count of the votes is too large.');
        }

        this.id = obj.id;
        this.streamerId = obj.streamerId;
        this.upvotes = obj.upvotes;
        this.downvotes = obj.downvotes;
    }

    static async findAll(): Promise<VoteEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `votes`") as VoteRecordResults;

        return results.map(obj => new VoteRecord(obj));
    }

    static async getOne(id: string): Promise<VoteRecord | null> {
        const [results] = await pool.execute("SELECT * from `votes` WHERE `id` = :id", {
            id,
        }) as VoteRecordResults;
        return results.length === 0 ? null : new VoteRecord(results[0]);
    }

    static async findAllWithStreamerId(streamerId: string): Promise<VoteEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `votes` WHERE `streamerId` = :streamerId", {
            streamerId,
        }) as VoteRecordResults;

        return results.map(obj => new VoteRecord(obj));
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