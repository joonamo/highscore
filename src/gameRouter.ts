import { Router } from "express" 
import { getScores, persistScore } from "./scoreService"
import { NO_CONTENT } from "http-status-codes"

export const gameRouter = Router()

gameRouter.get("/:gameId/scores", async (req, res, next) => {
  try {
    const gameId = req.params["gameId"]
    const scores = await getScores(gameId)
    res.json(scores)
  } catch (e) {
    next(e)
  }
})

gameRouter.post("/:gameId/score", async (req, res, next) => {
  try {
    const gameId = req.params["gameId"]
    const { playerName, score } = req.body
    await persistScore(gameId, playerName, score)
    res.status(NO_CONTENT).send()
  } catch (e) {
    next(e)
  }
})