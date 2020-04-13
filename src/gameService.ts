import { UUID } from "./types"
import { db } from "./db"

export interface Game {
  id: UUID
  created: string
  name: string
  secret: string
  strictValidation: boolean
}

// interface GameFromDb extends Omit<Game, "created"> {
//   created: unknown
// }

// const fixDbOutput = (value: GameFromDb): Game => ({
//   ...value,
//   created: String(value.created)
// })

export const getGameById = async (id: UUID): Promise<Game> => {
  return await db.one<Game>(`
    SELECT id, created, name, secret, strict_validation as "strictValidation"
    FROM games
    WHERE id = $/id/
  `, {id})
}