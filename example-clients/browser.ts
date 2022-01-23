// Example browser TypeScript example was adapted from Convay's Garden Life
// https://github.com/joonamo/garden
// Requirements: moment.js and crypto-js
// Used under MIT License

import moment from "moment"
import CryptoJS from "crypto-js"

// Replace these with your keys. Consider using env variables with your bundler
const GAME_ID = "d33491cd-ecbd-4405-8b0a-dc89baab0893"
const GAME_SECRET = "secret"

export interface ScoreEntry {
  score: number
  player: string
  meta: any
}

export const postScore = async (player: string, score: number, meta: any) => {
  const time = moment().toISOString()
  const toValidate = `${GAME_ID}-${score}-${player}-${time}-${GAME_SECRET}`
  const validation = CryptoJS.MD5(toValidate).toString()
  return await fetch(
    process.env.REACT_APP_SCORE_URL + `/game/${encodeURIComponent(GAME_ID)}/score`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        player,
        score,
        time,
        validation,
        meta,
      }),
    },
  )
}

export const getScores = async (): Promise<ScoreEntry[]> => {
  const data = await (await fetch(
    process.env.REACT_APP_SCORE_URL + `/game/${encodeURIComponent(GAME_ID)}/scores?distinct=true`,
  )).json()
  return data
}