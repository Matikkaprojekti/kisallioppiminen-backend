import database from '../database'
import Exercise from '../models/Exercise'

export async function findOrCreateExercise(newExercise: Exercise): Promise<Exercise> {
  const { coursekey } = newExercise
  const instance = await database('exercises')
    .select()
    .where({ coursekey })
    .first()

  if (!instance) {
    const temp = await database('teachinginstances').insert(newExercise)

    const newlyCreatedinstance = await database('teachinginstances')
      .select()
      .where({ coursekey })
      .first()

    return newlyCreatedinstance
  }

  return instance
}
