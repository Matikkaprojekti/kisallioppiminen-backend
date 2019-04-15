import database from '../database'
import UsersTeachinginstance from '../models/UsersTeachingInstance'
import Teachinginstance from '../models/TeachingInstance'
import R from 'ramda'
import { ApiCourseInstanceObject } from '../types/apiTypes'
import Trafficlight from '../models/Trafficlight'
import User from '../models/User'

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

export async function removeTeachingInstanceWithUserIdAndCoursekey(userId: number, coursekey: string) {
  await database('usersteachinginstances')
    .delete()
    .where({ user_id: userId, course_coursekey: coursekey })
}

export async function findTeachingInstanceWithUserIdAndCoursekey(userId: number, coursekey: string): Promise<ApiCourseInstanceObject> {
  return await database('usersteachinginstances')
    .select()
    .where({ user_id: userId, course_coursekey: coursekey })
    .innerJoin('teachinginstances', 'usersteachinginstances.course_coursekey', '=', 'teachinginstances.coursekey')
    .first()
}

export async function findTeachingInstancesWithUserId(userId: number): Promise<ApiCourseInstanceObject[]> {
  // Get ordered list of users teachigninstances
  const userTeachingInstancePromise = database('usersteachinginstances')
    .select()
    .where({ user_id: userId })
    .innerJoin('teachinginstances', 'usersteachinginstances.course_coursekey', '=', 'teachinginstances.coursekey')
    .orderBy('joindate', 'desc')

  const trafficlightPromise = database('trafficlights')
    .select()
    .where({ user_id: userId })
    .innerJoin('users', 'users.id', '=', 'trafficlights.user_id')

  return Promise.all([userTeachingInstancePromise, trafficlightPromise]).then(([userTeachingInstance, trafficlights]) => formatUserTeachingInstanceData(userTeachingInstance, trafficlights))
}

export function isUserAlreadyInCourse(userId: number, coursekey: string) {
  return database('usersteachinginstances')
    .count()
    .where({ user_id: userId, course_coursekey: coursekey })
    .first()
    .then(({ count }) => count > 0)
}

function formatUserTeachingInstanceData(array: Array<UsersTeachinginstance & Teachinginstance>, trafficlights: Array<Trafficlight & User>): ApiCourseInstanceObject[] {
  const { firstname, lastname } = trafficlights.length > 0 ? trafficlights[0] : { firstname: '', lastname: '' }
  return array.map(
    R.pipe(
      R.pick(['coursekey', 'coursematerial_name', 'version', 'name', 'startdate', 'enddate', 'owner_id']),
      ({ coursekey, coursematerial_name, version, name, startdate, enddate, owner_id }) => ({
        coursekey,
        coursematerial_name,
        version: String(version),
        name,
        startdate: String(startdate),
        enddate: String(enddate),
        owner_id,
        students: [
          {
            firstname,
            lastname,
            exercises: trafficlights.filter(({ coursekey: ck }) => ck === coursekey).map(({ uuid, status }) => ({ uuid, status: String(status) }))
          }
        ]
      })
    )
  )
}
