import { StreamerEntity } from "../types";
import { ValidationError } from "../utils/errors";
import { pool } from "../utils/db";
import { v4 as uuid } from "uuid";
import { FieldPacket } from "mysql2";

type StreamerRecordResults = [StreamerEntity[], FieldPacket[]];

export class StreamerRecord implements StreamerEntity {
  public id: string;
  public name: string;
  public description: string;
  public platform: string;
  public createdAt: Date;

  constructor(obj: StreamerEntity) {
    if (!obj.name || obj.name.length > 100) {
      throw new ValidationError(
        "Enter the name of the streamer with a length of max. 100 characters."
      );
    }
    if (obj.name.length < 3) {
      throw new ValidationError(
          "Enter the name of the streamer with a length of min. 3 characters."
      );
    }
    if (!obj.description || obj.description.length > 1000) {
      throw new ValidationError(
        "Enter the description of the streamer with a length of max. 1000 characters."
      );
    }
    if (obj.description.length < 10) {
      throw new ValidationError(
          "Enter the description of the streamer with a length of min. 10 characters."
      );
    }
    if (!obj.platform) {
      throw new ValidationError(
          "Select the streaming platform from the drop-down list."
      );
    }

    this.id = obj.id;
    this.name = obj.name;
    this.description = obj.description;
    this.platform = obj.platform;
    this.createdAt = obj.createdAt;
  }

  static async findAll(): Promise<StreamerEntity[]> {
    const [results] = (await pool.execute(
      "SELECT * FROM `streamers` ORDER BY `createdAt` ASC"
    )) as StreamerRecordResults;

    return results.map((obj) => new StreamerRecord(obj));
  }

  static async getOne(streamerId: string): Promise<StreamerRecord | null> {
    const [results] = (await pool.execute(
      "SELECT * FROM `streamers` WHERE `id` = :streamerId",
      {
        streamerId,
      }
    )) as StreamerRecordResults;
    return results.length === 0 ? null : new StreamerRecord(results[0]);
  }

  static async getOneByName(name: string): Promise<StreamerRecord | null> {
    const [results] = (await pool.execute(
      "SELECT * from `streamers` WHERE `name` = :name",
      {
        name,
      }
    )) as StreamerRecordResults;
    return results.length === 0 ? null : new StreamerRecord(results[0]);
  }

  async insert(): Promise<string> {
    const existingStreamer = await StreamerRecord.getOneByName(this.name);
    if (existingStreamer) {
      throw new ValidationError("Streamer with the same name already exists.");
    }

    if (!this.id || !this.createdAt) {
      this.id = uuid();
      this.createdAt = new Date();
    } else {
      throw new Error(`Cannot add something that already exists.`);
    }

    await pool.execute(
      "INSERT INTO `streamers`(`id`, `name`, `description`, `platform`, `createdAt`) VALUES(:id, :name, :description, :platform, :createdAt)",
      this
    );

    return this.id;
  }

  async delete(): Promise<void> {
    await pool.execute("DELETE FROM `streamers` WHERE `id` = :id", {
      id: this.id,
    });
  }
}
