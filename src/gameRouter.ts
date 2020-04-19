import { Router } from "express" 
import { getScores, persistScore, validateScore, getDistinctScores } from "./scoreService"
import { NO_CONTENT, FORBIDDEN } from "http-status-codes"

export const gameRouter = Router()

gameRouter.get("/:gameId/scores", async (req, res, next) => {
  try {
    const gameId = req.params["gameId"]
    const { distinct } = req.query
    const query = distinct ? getDistinctScores : getScores
    const scores = await query(gameId)
    res.json(scores)
  } catch (e) {
    next(e)
  }
})

gameRouter.post("/:gameId/score", async (req, res, next) => {
  try {
    const gameId = req.params["gameId"]
    const { player, score, meta, validation, time } = req.body
    if (await validateScore({ gameId, player, score, meta, validation, time })) {
      await persistScore(gameId, player, score, meta)
      res.status(NO_CONTENT).send()
    } else {
      res.status(FORBIDDEN).send()
    }
  } catch (e) {
    next(e)
  }
})