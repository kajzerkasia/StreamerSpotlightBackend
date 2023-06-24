import {Router} from "express";
import {ValidationError} from "../utils/errors";
import {VoteRecord} from "../records/vote.record";
const DOMPurify = require('isomorphic-dompurify');

export const voteRouter = Router()

    .get('/vote', async (req, res) => {

        if (typeof req.query.streamerId === 'string') {
            return res.json(await VoteRecord.findAllWithStreamerId(DOMPurify.sanitize(req.query.streamerId)));
        }

        return res.json(await VoteRecord.findAll());

    })

    .get('/vote/:id', async (req, res) => {
        const vote = await VoteRecord.getOne(req.params.id);

        res.json(vote);
    })

    .put('/vote/:id', async (req, res) => {

        const vote = await VoteRecord.getOne(req.params.id);

        if (vote === null) {
            throw new ValidationError('No such vote found.');
        }

        // req.body DOMPurify.sanitize

        await vote.update();

        res.json(vote);
    })
