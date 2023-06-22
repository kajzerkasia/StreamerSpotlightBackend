import express, {json, Router} from "express";
import cors from 'cors';
import 'express-async-errors';
import {handleError, ValidationError} from "./utils/errors";
import {streamerRouter} from "./routers/streamer.router";
import {voteRouter} from "./routers/vote.router";

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(json());

const router = Router();

router.use('/streamer', streamerRouter);
router.use('/vote', voteRouter)

app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on port http://localhost:3001');
})