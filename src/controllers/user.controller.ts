import { Router, Request, Response } from 'express'
import passport from 'passport'

const router: Router = Router()

router.use(passport.initialize())
router.use(passport.session())

router.get('/auth', passport.authenticate('google', { scope: ['profile'] }), (req: Request, res: Response) => {
  res.send('Authenticated')
})

router.get('/auth/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(process.env.NODE_ENV === 'dev' ? 'http://localhost:3000' : process.env.PROD_URL)
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
    return res.json({ id, name })
  }
  res.status(401).json({ error: 'Unauthorized' })
})

// Create a user
router.post('/', (req: Request, res: Response) => {
  console.log(req.body)
  res.json({ message: 'todo' })
})

export const UserController: Router = router
