// Update with your config settings.
require("dotenv").config()

const settings = {
  client: "postgresql",
  connection: process.env.DATABASE_URL
}

module.exports = {
  development: settings,
  staging: settings,
  production: settings
};
