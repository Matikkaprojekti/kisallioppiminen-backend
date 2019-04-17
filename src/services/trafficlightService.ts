import database from '../database'
import Trafficlight from '../models/Trafficlight'

export async function updateOrCreateTrafficlight(newTrafficlight: Trafficlight): Promise<Trafficlight> {
  const { uuid, status, user_id, coursekey } = newTrafficlight
  const trafficlight = await database('trafficlights')
    .select()
    .where({ uuid, user_id, coursekey })
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
      .where({ uuid, user_id, coursekey })
      .update({
        status: newTrafficlight.status
      })
    console.log('UPDATE FINISHED')
    return updatedTrafficlight
  }
}

export async function findTrafficlightsByUserIdAndCoursekey(userId: string, coursekey: string): Promise<Array<{ uuid: string; status: string }>> {
  const exerciselist: Array<Promise<{ uuid: string; status: string }>> = await database('trafficlights')
    .select('uuid', 'status')
    .where({ coursekey, user_id: userId })

  return Promise.all(exerciselist)
}
