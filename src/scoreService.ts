import { UUID } from "./types"
import { db } from "./db"

export interface ScoreEntry {
  id: UUID
  time: string
  player: string
  score: number
  gameId: UUID
}

export const persistScore = async (gameId: UUID, playerName: string, score: number) => {
  await db.tx(t => t.none(`
    INSERT INTO scores (game_id, player, score)
    VALUES ($/gameId/, $/playerName/, $/score/);
  `, { gameId, playerName, score }
  ))
}

export const getScores = async (gameId: UUID, numScores: number = 10): Promise<ScoreEntry[]> => {
  return await db.manyOrNone<ScoreEntry>(`
    SELECT id, time, player, score, game_id as "gameId"
    FROM scores
    WHERE game_id = $/gameId/
    ORDER BY score DESC
    LIMIT $/numScores/;
  `, { gameId, numScores })
}