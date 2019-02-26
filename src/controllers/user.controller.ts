import { Router, Request, Response } from 'express'

const router: Router = Router()

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
