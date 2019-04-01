import database from '../database'
import Teachinginstance from '../models/TeachingInstance'

export async function findOrCreateTeachinginstance(newTeachingInstance: Teachinginstance): Promise<Teachinginstance> {
  const { coursekey } = newTeachingInstance
  const instance = await database('teachinginstances')
    .select()
    .where({ coursekey })
    .first()

  if (!instance) {
    const temp = await database('teachinginstances').insert(newTeachingInstance)

    const newlyCreatedinstance = await database('teachinginstances')
      .select()
      .where({ coursekey })
      .first()

    return newlyCreatedinstance
  }

  return instance
}

export async function findTeachinginstanceByCoursekey(coursekey: string): Promise<Teachinginstance | null> {
  const instance = await database('teachinginstances')
    .select('*')
    .where({ coursekey })
    .first()

  if (instance) {
    return instance
  } else {
    return undefined
  }
}

// tslint:disable-next-line
export async function findTeachingInstancesByOwnerId(owner_id: number): Promise<Teachinginstance | null> {
  const instances = await database('teachinginstances')
    .select('*')
    .where({ owner_id })

  if (instances) {
    return instances
  } else {
    return undefined
  }
}
