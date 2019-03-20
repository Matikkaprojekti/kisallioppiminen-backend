import database from '../database'
import UsersTeachinginstance from '../models/UsersTeachingInstance'

export async function findOrCreateUsersTeachinginstance(newUsersTeachinginstance: UsersTeachinginstance): Promise<UsersTeachinginstance> {
  const instance = await database('usersteachinginstances')
    .select()
    .where({ user_id: newUsersTeachinginstance.user_id, course_coursekey: newUsersTeachinginstance.course_coursekey })

  console.log(instance)

  if (!instance) {
    const temp = await database('usersteachinginstances').insert(newUsersTeachinginstance)

    const newlyCreatedinstance = await database('usersteachinginstances')
      .select()
      .where({ user_id: newUsersTeachinginstance.user_id, course_coursekey: newUsersTeachinginstance.course_coursekey })

    return newlyCreatedinstance
  }

  return instance
}
