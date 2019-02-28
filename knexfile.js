// Update with your config settings.
require('dotenv').config()

module.exports = {
  client: 'pg',
  connection: {
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_URL,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME
  }
}
