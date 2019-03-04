import { Router, Request, Response } from 'express'
import passport from 'passport'

import GoogleStrategy from 'passport-google-oauth20'
import { findOrCreate, findUserById } from '../services/userService'
import User from '../models/User'

const router: Router = Router()

router.use(passport.initialize())
router.use(passport.session())

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.NODE_ENV === 'dev' ? 'http://localhost:8000' : process.env.PROD_URL}/users/auth/callback`
  },
  (accessToken: any, refreshToken: any, profile: {id: number, name: {familyName: string, givenName: string}}, cb: any) => {
    findOrCreate({ googleId: profile.id, name: profile.name.givenName })
      .then(result => {
        return cb(null, result)
      }).catch(e => {
        return cb(e, null)
      })
  }
))

passport.serializeUser(({id}: User, done) => {
  done(null, id)
})

passport.deserializeUser((id: number, done) => {
  findUserById(id)
    .then(user => {
      console.log('asd', user)
      if (!user) {
        return done(new Error('Unauthorized'), null)
      }
      done(null, user)
    })
})

router.get('/auth', passport.authenticate('google', { scope: ['profile'] }), (req: Request, res: Response) => {
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
router.get('/:id(\\d)', (req: Request, res: Response) => {
  res.json({ error: 'user not found' })
})

// Get authorized user
router.get('/me', (req, res) => {
  const { user } = req
  if (user) {
    const { name, id } = user
    return res.json({id, name})
  }
  res.status(401).json({error: 'Unauthorized'})
})

// Create a user
router.post('/', (req: Request, res: Response) => {
  console.log(req.body)
  res.json({ message: 'todo' })
})

export const LoginController: Router = router
