// Ensure that .env is parsed before configuring db
import "./init"

import { IDatabase, IMain } from "pg-promise"
import pgPromise from "pg-promise"

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const dbUrl = process.env.DATABASE_URL!

export const pgp: IMain = pgPromise()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db: IDatabase<any> = pgp(dbUrl)

export function migrations() {
  return db.many("SELECT * FROM knex_migrations")
}

console.log(`Database connected to ${dbUrl}`)

export async function disconnectDb() {
  await db.$pool.end()
}
