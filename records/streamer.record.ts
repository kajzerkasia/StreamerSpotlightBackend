import {StreamerEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {v4 as uuid} from 'uuid';
import {FieldPacket} from "mysql2";

type StreamerRecordResults = [StreamerEntity[], FieldPacket[]];

export class StreamerRecord implements StreamerEntity {
    public id: string;
    public name: string;
    public streamerDescription: string;
    public platform: string;
    public platformDescription: string;
    public createdAt: Date;

    constructor(obj: StreamerEntity) {
        if (!obj.name || obj.name.length > 100) {
            throw new ValidationError('Enter the name of the streamer with a length of max. 100 characters.');
        }
        if (!obj.streamerDescription || obj.streamerDescription.length > 500) {
            throw new ValidationError(`Enter the streamer's description with a length of max. 500 characters.`);
        }
        if (!obj.platform || obj.platform.length > 100) {
            throw new ValidationError(`Enter the name of the streamer's platform with a length of max. 100 characters.`);
        }
        if (!obj.platformDescription || obj.platformDescription.length > 500) {
            throw new ValidationError(`Enter the platform's description with a length of max. 500 characters.`);
        }

        this.id = obj.id;
        this.name = obj.name;
        this.streamerDescription = obj.streamerDescription;
        this.platform = obj.platform;
        this.platformDescription = obj.platformDescription;
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

        await pool.execute("INSERT INTO `streamers`(`id`, `name`, `streamerDescription`, `platform`, `platformDescription`, `createdAt`) VALUES(:id, :name, :streamerDescription, :platform, :platformDescription, :createdAt)", this);

        return this.id;
    }

    async update() {

        await pool.execute("UPDATE `streamers` SET `name` = :name, `streamerDescription` = :streamerDescription, `platform` = :platform, `platformDescription` = :platformDescription WHERE `id` = :id", {
            id: this.id,
            name: this.name,
            streamerDescription: this.streamerDescription,
            platform: this.platform,
            platformDescription: this.platformDescription,
        });

    }

    async delete(): Promise<void> {
        await pool.execute("DELETE FROM `streamers` WHERE `id` = :id", {
            id: this.id,
        })
    }
}