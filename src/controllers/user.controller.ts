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

// Create a user
router.post('/', async (req: Request, res: Response) => {
  const name = req.body.name
  const googleid = req.body.googleid

  const id = await database('users').insert({ name, googleid }, 'id')

  const user = await database('users').select('*')

  res.json({ user })
})

export const LoginController: Router = router
