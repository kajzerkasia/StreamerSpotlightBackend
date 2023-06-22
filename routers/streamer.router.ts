import {Router} from "express";
import {StreamerRecord} from "../records/streamer.record";
import {ValidationError} from "../utils/errors";

export const streamerRouter = Router()

    .get('/streamers', async (req, res) => {
        const streamers = await StreamerRecord.findAll();

        res.json(streamers);
    })

    .get('/streamer/:streamerId', async (req, res) => {
        const streamer = await StreamerRecord.getOne(req.params.streamerId);

        res.json(streamer);
    })

    .post('/streamers', async (req, res) => {
        const streamers = new StreamerRecord(req.body);
        await streamers.insert();

        res.json(streamers);
    })

    .put('/streamers/:streamerId/vote', async (req, res) => {

        const streamer = await StreamerRecord.getOne(req.params.streamerId);

        if (streamer === null) {
            throw new ValidationError('Nie znaleziono takiej zasady.');
        }

        // req.body DOMPurify.sanitize

        await streamer.update();

        res.json(streamer);
    })
