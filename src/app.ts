import "./init"

import express from "express"
import bodyParser from "body-parser"
import winston from "winston"
import expressWinston from "express-winston"
import { gameRouter } from "./gameRouter"

// Create Express server
const app = express()

// Express configuration
app.set("port", process.env.PORT || 3000)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
}))

app.use("/game", gameRouter)

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
    winston.format.prettyPrint()
  )
}))

export default app
