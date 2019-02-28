require('dotenv').config()

const { Client } = require('pg')

async function createDatabase() {
  const client = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_URL,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    database: 'postgres'
  })

  await client.connect()
  await client.query('CREATE DATABASE kisallioppiminen;')
  await client.end()
}

createDatabase()
