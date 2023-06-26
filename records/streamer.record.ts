import {StreamerEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {v4 as uuid} from 'uuid';
import {FieldPacket} from "mysql2";

type StreamerRecordResults = [StreamerEntity[], FieldPacket[]];

export class StreamerRecord implements StreamerEntity {
    public id: string;
    public name: string;
    public description: string;
    public platform: string;
    public createdAt: Date;

    constructor(obj: StreamerEntity) {
        if (!obj.name || obj.name.length > 100) {
            throw new ValidationError('Enter the name of the streamer with a length of max. 100 characters.');
        }
        if (!obj.description || obj.description.length > 500) {
            throw new ValidationError('Enter the description of the streamer with a length of max. 500 characters.');
        }
        if (!obj.platform || obj.platform.length > 100) {
            throw new ValidationError(`Enter the name of the streamer's platform with a length of max. 100 characters.`);
        }

        this.id = obj.id;
        this.name = obj.name;
        this.description = obj.description;
        this.platform = obj.platform;
        this.createdAt = obj.createdAt;
    }

    static async findAll(): Promise<StreamerEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `streamers` ORDER BY `createdAt` ASC") as StreamerRecordResults;

        return results.map(obj => new StreamerRecord(obj));
    }

    static async getOne(streamerId: string): Promise<StreamerRecord | null> {
        const [results] = await pool.execute("SELECT * from `streamers` WHERE `id` = :id", {
            streamerId,
        }) as StreamerRecordResults;
        return results.length === 0 ? null : new StreamerRecord(results[0]);
    }

    async insert(): Promise<string> {

        if (!this.id || !this.createdAt) {
            this.id = uuid();
            this.createdAt = new Date();
        } else {
            throw new Error(`Cannot add something that already exists.`);
        }

        await pool.execute("INSERT INTO `streamers`(`id`, `name`, `description`, `platform`, `createdAt`) VALUES(:id, :name, :description, :platform, :createdAt)", this);

        return this.id;
    }

    async delete(): Promise<void> {
        await pool.execute("DELETE FROM `streamers` WHERE `id` = :id", {
            id: this.id,
        })
    }
}