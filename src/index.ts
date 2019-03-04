import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import bodyParser from 'body-parser'
import { LoginController } from './controllers'
import cp from 'cookie-parser'
import expressSession from 'express-session'

const app = express()
const port = process.env.APP_PORT || 8000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cp())
app.use(expressSession({
  secret: 'paska',
  resave: true,
  saveUninitialized: true
}))

app.use('/users', LoginController)

app.get('/', (req, res) => {
  console.log(req)
  res.json({
    message: 'Hello world'
  })
})

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
