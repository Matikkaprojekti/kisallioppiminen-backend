import { Router, Request, Response } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const router: Router = Router()

router.use(passport.initialize())
router.use(passport.session())

router.get('/auth', passport.authenticate('google', { scope: ['profile'] }), (req: Request, res: Response) => {
  res.send('Authenticated')
})

router.get('/auth/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  const { user } = req
  if (!user) {
    return res.redirect(process.env.NODE_ENV === 'dev' ? 'http://localhost:3000' : process.env.FRONTEND_URL)
  }
  const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET)
  res.redirect(process.env.NODE_ENV === 'dev' ? 'http://localhost:3000?token=' + token : process.env.FRONTEND_URL + '?token=' + token)
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
router.get('/me', passport.authenticate('jwt', {session: false}), (req, res) => {
  const { user } = req
  if (user) {
    const { name, id, lastname } = user
    return res.json({ id, name, lastname })
  }
  res.status(401).json({ error: 'Unauthorized' })
})

// Create a user
router.post('/', (req: Request, res: Response) => {
  console.log(req.body)
  res.json({ message: 'todo' })
})

export const UserController: Router = router
