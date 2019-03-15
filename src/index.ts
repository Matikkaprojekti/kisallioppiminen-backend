import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import bodyParser from 'body-parser'
import { UserController } from './controllers'
import cp from 'cookie-parser'
import expressSession from 'express-session'
import { passportInitializer } from './passport'

const app = express()
const port = process.env.PORT || 8000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cp())
app.use(
  expressSession({
    cookie: {domain: process.env.COOKIE_DOMAIN, secure: true},
    secret: 'paska',
    resave: true,
    saveUninitialized: true
  })
)
passportInitializer(app)
app.use('/users', UserController)

app.get('/', (req, res) => {
  console.log(req)
  res.json({
    message: 'Hello world'
  })
})

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
