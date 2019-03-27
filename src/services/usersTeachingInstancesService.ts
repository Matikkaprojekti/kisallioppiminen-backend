import database from '../database'
import UsersTeachinginstance from '../models/UsersTeachingInstance'
import Teachinginstance from '../models/TeachingInstance'
import R from 'ramda'
import { ApiCourseInstanceObject } from '../types/apiTypes'

export async function findOrCreateUsersTeachinginstance(newUsersTeachinginstance: UsersTeachinginstance): Promise<UsersTeachinginstance> {
  const instance = await database('usersteachinginstances')
    .select()
    .where({ user_id: newUsersTeachinginstance.user_id, course_coursekey: newUsersTeachinginstance.course_coursekey })
    .first()

  const { user_id, course_coursekey } = newUsersTeachinginstance

  if (!instance) {
    const temp = await database('usersteachinginstances').insert(newUsersTeachinginstance)

    const newlyCreatedinstance = await database('usersteachinginstances')
      .select()
      .where({ user_id, course_coursekey })

    return newlyCreatedinstance
  }

  return instance
}

export async function findTeachingInstancesWithUserId(userId: number): Promise<ApiCourseInstanceObject[]> {
  return database('usersteachinginstances')
    .select()
    .where({user_id: userId})
    .innerJoin('teachinginstances', 'usersteachinginstances.course_coursekey', '=', 'teachinginstances.coursekey')
    .then(formatUserTeachingInstanceData)

}

function formatUserTeachingInstanceData(array: Array<UsersTeachinginstance & Teachinginstance>): ApiCourseInstanceObject[] {
  return array.map(
    R.pipe(
      R.pick(['coursekey', 'coursematerial_name', 'coursematerial_version', 'name', 'startdate', 'enddate']),
    ({coursekey, coursematerial_name, coursematerial_version, name, startdate, enddate}) =>
      ({coursekey, coursematerial_name, version: String(coursematerial_version), name, startdate, enddate, students: []})
    )
  )
}
