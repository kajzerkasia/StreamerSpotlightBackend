import {Router} from "express";
import {StreamerRecord} from "../records/streamer.record";
import {ValidationError} from "../utils/errors";
const DOMPurify = require('isomorphic-dompurify');

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

    .delete('/streamers/:id', async (req, res) => {
        const streamer = await StreamerRecord.getOne(req.params.id)

        if (!streamer) {
            throw new ValidationError('No such streamer found.');
        }

        await streamer.delete();

        res.end();
    })

    // .put('/streamers/:streamerId/vote', async (req, res) => {
    //
    //     const streamer = await StreamerRecord.getOne(req.params.streamerId);
    //
    //     if (streamer === null) {
    //         throw new ValidationError('The number of votes for this streamer was not found.');
    //     }
    //
    //     // req.body DOMPurify.sanitize
    //
    //     await streamer.update();
    //
    //     res.json(streamer);
    // })

    .put('/streamers/:id', async (req, res) => {

        const streamer = await StreamerRecord.getOne(req.params.id);

        if (streamer === null) {
            throw new ValidationError('No such streamer found.');
        }

        streamer.name = DOMPurify.sanitize(req.body.name);
        streamer.platform = DOMPurify.sanitize(req.body.platform);

        await streamer.update();

        res.json(streamer);

    })
