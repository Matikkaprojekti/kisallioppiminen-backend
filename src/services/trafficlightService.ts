import database from '../database'
import Trafficlight from '../models/Trafficlight'

export async function updateOrCreateTrafficlight(newTrafficlight: Trafficlight): Promise<Trafficlight> {
  const { exercise_uuid, status, user_id, coursekey } = newTrafficlight
  const trafficlight = await database('trafficlights')
    .select()
    .where({ exercise_uuid, user_id, coursekey })
    .first()

  if (!trafficlight) {
    const temp = await database('trafficlights').insert(newTrafficlight)

    const newlyCreatedExercise = await database('trafficlights')
      .select()
      .where({})
      .first()

    console.log('New trafficlight created.')

    return newlyCreatedExercise
  } else if (trafficlight && trafficlight.status !== newTrafficlight.status) {
    // Käyttäjä on jo klikannut kyseisen kurssin liikennevaloa, päivitetään sen väriä.

    console.log('changing ', trafficlight.status, 'to ', newTrafficlight.status)
    const updatedTrafficlight = await database('trafficlights')
      .where({ exercise_uuid, user_id, coursekey })
      .update({
        status: newTrafficlight.status
      })
    console.log('UPDATE FINISHED')
    return updatedTrafficlight
  }
}
