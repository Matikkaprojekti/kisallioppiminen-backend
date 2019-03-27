import database from '../database'
import Exercise from '../models/Exercise'

export async function findOrCreateExercise(newExercise: Exercise): Promise<Exercise> {
  const { uuid } = newExercise
  const instance = await database('exercises')
    .select()
    .where({ uuid })
    .first()

  if (!instance) {
    const temp = await database('exercises').insert(newExercise)

    const newlyCreatedExercise = await database('exercises')
      .select()
      .where({ uuid })
      .first()

    console.log('New exercise created.')

    return newlyCreatedExercise
  }

  return instance
}
