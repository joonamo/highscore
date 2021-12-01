// Update with your config settings.
require("dotenv").config()

const settings = {
  client: "postgresql",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "true" && {
      rejectUnauthorized: true,
      ca: process.env.DB_CA
    }
  }
}

module.exports = {
  development: settings,
  staging: settings,
  production: settings
};
