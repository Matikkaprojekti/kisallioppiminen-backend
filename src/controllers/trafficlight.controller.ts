import { Router, Request, Response } from 'express'
import Exercise from '../models/Exercise'
import passport from 'passport'

const router: Router = Router()

// React to trafficlight click
router.put('/:exercise_uuid', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  const exercise_uuid = req.params.exercise_uuid // = tehtävän yksilövä UUID
  const { status, coursekey } = req.body
  const { user } = req

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // tslint:disable-next-line
  const user_id = user.id

  console.log(exercise_uuid, status, user_id, coursekey)

  const newExercise = { exercise_uuid, coursekey }
  // Luodaan exercise jos sitä ei ole olemassa...

  // Luodaan uusi trafficlights merkintä tai päivitetään vanhaa

  res.status(200)
  res.send('OK')
})

export const TrafficlightController: Router = router
