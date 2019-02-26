import { Router, Request, Response } from 'express'
import { RequestError } from 'request-promise/errors'
import passport from 'passport'
import User from '../models/User'
// import { Strategy } from 'passport-google-oauth20'

import database from '../database'
import GoogleStrategy from 'passport-google-oauth20'

const router: Router = Router()

const findOrCreate = (eka: any, toka: any) => {
  console.log(eka)
  console.log(toka)
}

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8000/users/auth/callback'
  },
  (accessToken: any, refreshToken: any, profile: any, cb: any) => {
    console.log(profile)
    const user = new User()
    user.findOrCreate({ googleId: profile.id }, (err: any, user: any) => {
      return cb(err, user)
    })
  }
))

router.get('/auth', passport.authenticate('google', { scope: ['profile'] }), (req: Request, res: Response) => {
  // passport.authenticate('google', { scope: ['profile'] })
  res.send('Authenticated')
})

router.get('/auth/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/')
  })

// Get all users
router.get('/', (req: Request, res: Response) => {
  res.send('Create user with POST')
})

// Get a user by id
router.get('/:id', (req: Request, res: Response) => {
  res.json({ error: 'user not found' })
})

// Create a user
router.post('/', (req: Request, res: Response) => {
  console.log(req.body)
  res.json({ message: 'todo' })
})

export const LoginController: Router = router
