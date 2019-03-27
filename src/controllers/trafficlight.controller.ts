import { Router, Request, Response } from 'express'
import Exercise from '../models/Exercise'
import Trafficlight from '../models/Trafficlight'
import passport from 'passport'
import { findOrCreateExercise } from '../services/exerciseService'
import { updateOrCreateTrafficlight } from '../services/trafficlightService'

const router: Router = Router()

// React to trafficlight click
router.put('/:uuid', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  const uuid = req.params.uuid // = tehtävän yksilövä UUID
  const { status, coursekey } = req.body
  const { user } = req

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (status && coursekey) {
    // tslint:disable-next-line
    const user_id = user.id

    // Luodaan exercise jos sitä ei ole olemassa...
    const newExercise = { uuid, coursekey }
    const result = await findOrCreateExercise(newExercise)

    // Päivitetään tai luodaan uusi tietokantamerkintä tälle yksilöidylle nappulalle.
    // tslint:disable-next-line
    const exercise_uuid = uuid
    const newTrafficlightEntry = { exercise_uuid, coursekey, status, user_id }
    await updateOrCreateTrafficlight(newTrafficlightEntry)

    return res.status(200).json({ message: 'Update finished.' })
  } else {
    return res.status(400).json({ error: 'Some request params are missing.' })
  }
})

export const TrafficlightController: Router = router
