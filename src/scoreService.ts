import { UUID } from "./types"
import { db } from "./db"
import moment from "moment"
import { getGameById } from "./gameService"
import crypto from "crypto"

export interface ScoreEntry {
  id: UUID
  time: string
  player: string
  score: number
  gameId: UUID
  meta: unknown
}

export interface ScorePost extends Omit<ScoreEntry, "id"> {
  validation: string
}

interface ScoreEntryFromDb extends Omit<ScoreEntry, "score"> {
  score: string
  // time: unknown
}

const fixDbOutput = (values: ScoreEntryFromDb[]): ScoreEntry[] =>
  values.map(v => ({
    ...v,
    score: Number(v.score),
    // time: String(v.time)
  }))

export const persistScore = async (gameId: UUID, player: string, score: number, meta: unknown) => {
  console.log("Saving score", {gameId, player, score, meta})  
  await db.tx(t => t.none(`
    INSERT INTO scores (game_id, player, score, meta)
    VALUES ($/gameId/, $/player/, $/score/, $/meta/);
  `, { gameId, player, score, meta },
  ))
}

export const getScores = async (gameId: UUID, numScores: number = 10): Promise<ScoreEntry[]> => {
  return await db.manyOrNone<ScoreEntryFromDb>(`
    SELECT id, time, player, score, game_id as "gameId", meta
    FROM scores
    WHERE game_id = $/gameId/
    ORDER BY score DESC
    LIMIT $/numScores/;
  `, { gameId, numScores })
    .then(fixDbOutput)
}

export const getDistinctScores = 
async (gameId: UUID, numScores: number = 10): Promise<ScoreEntry[]> => {
  return await db.manyOrNone<ScoreEntryFromDb>(`
    SELECT *
    FROM (
      SELECT distinct on (a.player) player, *
      FROM (
        SELECT distinct on (score) score, player, id, time, game_id as "gameId", meta
        FROM scores
        WHERE game_id = $/gameId/
        ORDER BY score DESC, player desc, time ASC
        LIMIT 100
      ) a
    )b
    ORDER BY score DESC
    LIMIT $/numScores/;
  `, { gameId, numScores })
    .then(fixDbOutput)
}

export const validateScore = async (score: ScorePost): Promise<boolean> => {
  const game = await getGameById(score.gameId)
  if (!game.strictValidation) {
    return true
  }
  const timeDifference = moment().diff(score.time, "minute")
  if (Math.abs(timeDifference) > 3) {
    console.log("Posted score time too much different from server clock", score)
    return false
  }
  const toValidate = `${score.gameId}-${score.score}-${score.player}-${score.time}-${game.secret}`
  const validationHash = crypto.createHash("md5").update(toValidate).digest("hex")

  return validationHash === score.validation
}