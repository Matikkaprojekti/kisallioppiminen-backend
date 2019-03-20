import { Router, Request, Response } from 'express'
import Exercise from '../models/Exercise'

const router: Router = Router()

// React to trafficlight click
router.post('/click/:exercise_uuid', async (req: Request, res: Response) => {
  const exercise_uuid = req.params.exercise_uuid // = tehtävän yksilövä UUID
  const { status, user_id, coursekey } = req.body

  console.log(exercise_uuid, status, user_id, coursekey)

  const newExercise = { exercise_uuid, coursekey }
  // Luodaan exercise jos sitä ei ole olemassa...

  // Luodaan uusi trafficlights merkintä tai päivitetään vanhaa

  res.status(200)
  res.send('OK')
})

export const TrafficlightController: Router = router
