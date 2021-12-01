import "./init"

import express from "express"
import bodyParser from "body-parser"
import winston from "winston"
import expressWinston from "express-winston"
import { gameRouter } from "./gameRouter"
import cors from "cors"

// Create Express server
const app = express()
app.use(cors())

// Express configuration
app.set("port", process.env.PORT || 3000)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console(),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
    winston.format.prettyPrint(),
  ),
  meta: true,
  expressFormat: true,
  colorize: true,
}))

app.use("/game", gameRouter)

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
    winston.format.prettyPrint(),
  ),
}))

export default app
