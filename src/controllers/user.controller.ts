import { Router, Request, Response } from 'express'

const router: Router = Router()

import database from '../database'

// Get all users
router.get('/', (req: Request, res: Response) => {
  res.send('Create user with POST')
})

// Get a user by id
router.get('/:id', (req: Request, res: Response) => {
  res.json({ error: 'user not found' })
})

export const LoginController: Router = router
