import database from '../database'
import Teachinginstance from '../models/TeachingInstance'

export async function findOrCreate(newTeachingInstance: Teachinginstance): Promise<Teachinginstance> {
  const instance = await database('teachinginstances')
    .select()
    .where({ coursekey: newTeachingInstance.coursekey })
    .first()

  if (!instance) {
    const temp = await database('teachinginstances').insert(newTeachingInstance)

    const newlyCreatedinstance = await database('teachinginstances')
      .select()
      .where({ coursekey: newTeachingInstance.coursekey })
      .first()

    return newlyCreatedinstance
  }

  return instance
}
