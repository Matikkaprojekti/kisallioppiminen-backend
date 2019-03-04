import { Request, Response, NextFunction } from 'express'

export function fetchUser(req: Request, res: Response, next: NextFunction) {
  console.log('Checking if user is authenticated...')
  next()
}
