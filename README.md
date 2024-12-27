Deprecated! New maintained version is [highscore-supabase](https://github.com/joonamo/highscore-supabase)

# Highscore

A simple node.js server to store scoreboards for gamejam games. One server instance can serve multiple games and store arbitrary metadata with scores. API-only, doesn't come with any GUI. Supports posting the scores over HTTP as JSON or form data, metadata supported only on JSON. Supports simple verification of posted scores to avoid someone just spamming whatever score they want.

## Example games

- [Conway's Garden Life](https://www.joonamo.com/games/garden)
- [Unstables](https://www.joonamo.com/games/unstables)

## Requirements

- [node.js](https://nodejs.org/en/) 16.13.2
- [yarn](https://yarnpkg.com/) 1.22.17
- [PostgreSQL](https://www.postgresql.org/) 13
- A database browser (for managing games)

## Installation

- Install a correct version of node. If you're using [nvm](https://github.com/nvm-sh/nvm), you can just run `nvm use` in the root directory.
- Install [yarn](https://yarnpkg.com/). Version of yarn shouldn't be that important as long as it's at least 1.22.17. You can probably just install the newest one with `npm i -g yarn`.
- Install dependencies by running `yarn`
- Create a PostgreSQL database for the app. It has been tested to work on PostgreSQL versions 13 and 14, but we're not using anything too fancy, so other versions could work.
- Create a `.env` file with `DATABASE_URL` variable. For example `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/highscore`. For other environment variables see below
- Run migrations with `yarn migrate`
- Run the server in development mode with `yarn dev`

## Adding new games

Adding a new game requires game info to be added in the `games`-table. Connect to your database with your favourite database browser and create new row with at least `name` field filled. If you want to use strict validation, provide validation secret in `secret` field and set `strict_validation` `TRUE`.

## Clients

Example clients are provided in `example-clients` folder. The server works with rest API, so creating new clients on different platforms shouldn't be too difficult.

## Environment variables

Environment variables can be loaded from .env file or in the application running environment. Following variables are supported:

```ini
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/highscore
PORT=3000
# When connecting to DB with ssl enabled, DB CA cert is required
DB_CA="-----BEGIN CERTIFICATE-----\nCertificate\nGoes\nHere\n-----END CERTIFICATE-----\n"
```

## Migrations

Migrations are managed with [Knex](https://knexjs.org/). Migrations can be found under migrations folder.

- To apply all migrations, run `yarn migrate`
- To rollback latest migrations, run `yarn knex migrate:rollback`
- To create new migrations, run `yarn knex migrate:make migration-name-here`

## Running in production

The server is tested to run in Heroku-like environments on [Dokku](https://dokku.com/) and [Digital Ocean App Platform](https://try.digitalocean.com/app-platform). To get the app running, following things need to happen:

- Install required versions of Node and Yarn, install JavaScript dependencies with yarn (Many app platforms do this automatically)
- Build the app with `yarn build` (Many app platforms do this automatically)
- Provide at least DATABASE_URL env variable in .env file. If database connection uses ssl, also provide DB_CA
- It is recommended to always start the server with `yarn migrate && yarn start`. This will ensure the server always runs with latest migrations applied.

First migration installs uuid-ossp plugin in the database. If your server's database user doesn't have privilleges to install plugins, you can install the plugin with admin user and then run the migrations.

## Licence

MIT Licence, see LICENCE
