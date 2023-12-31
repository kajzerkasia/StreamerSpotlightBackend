import { Router } from "express";
import { ValidationError } from "../utils/errors";
import { VoteRecord } from "../records/vote.record";

export const voteRouter = Router()
  .get("/streamers/:streamerId/vote", async (req, res) => {
    const streamerId = req.params.streamerId;

    try {
      const vote = await VoteRecord.getOneByStreamerId(streamerId);

      if (!vote) {
        throw new ValidationError("No vote record found for the streamer.");
      }

      res.json({
        likes: vote.upvotes,
        dislikes: vote.downvotes,
        hasVotedFor: vote.upvotes > 0,
        hasVotedAgainst: vote.downvotes > 0,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })

  .get("/vote/:id", async (req, res) => {
    const vote = await VoteRecord.getOne(req.params.id);

    res.json(vote);
  })

  .post("/vote", async (req, res) => {
    const vote = new VoteRecord(req.body);
    await vote.insert();

    res.json(vote);
  })

  .put("/streamers/:streamerId/vote", async (req, res) => {
    const { streamerId } = req.params;
    const { vote } = req.body;

    try {
      const voteRecord = await VoteRecord.getOneByStreamerId(streamerId);

      if (!voteRecord) {
        return res.status(404).json({ error: "Streamer not found" });
      }

      if (vote === "upvote") {
        voteRecord.upvotes += 1;
      } else if (vote === "downvote") {
        voteRecord.downvotes += 1;
      } else {
        return res.status(400).json({ error: "Invalid vote value" });
      }

      await voteRecord.update();

      res.json({
        upvotes: voteRecord.upvotes,
        downvotes: voteRecord.downvotes,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })

  .put("/vote/:id", async (req, res) => {
    const vote = await VoteRecord.getOne(req.params.id);

    if (vote === null) {
      throw new ValidationError("No such vote found.");
    }

    await vote.update();

    res.json(vote);
  });
