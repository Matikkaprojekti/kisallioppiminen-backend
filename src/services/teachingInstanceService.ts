import database from '../database'
import Teachinginstance from '../models/TeachingInstance'
import UsersTeachingInstance from '../models/UsersTeachingInstance'
import Trafficlight from '../models/Trafficlight'
import R from 'ramda'
import User from '../models/User'
import { ApiStudentObject, ApiCourseInstanceObject } from '../types/apiTypes'

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

export async function findTeachinginstanceByCoursekey(coursekey: string): Promise<Teachinginstance> {
  return await database('teachinginstances')
    .select('*')
    .where({ coursekey })
    .first()
}

// tslint:disable-next-line
export async function findTeachingInstancesByOwnerId(owner_id: number): Promise<ApiCourseInstanceObject[] | null> {
  const userTeachingInstancePromise = database('teachinginstances')
    .select()
    .where({ owner_id })
    .leftJoin('usersteachinginstances', 'usersteachinginstances.course_coursekey', '=', 'teachinginstances.coursekey')

  const studentsPromise = database('trafficlights').leftJoin('users', 'users.id', '=', 'trafficlights.user_id')

  return Promise.all([userTeachingInstancePromise, studentsPromise]).then(([userTeachingInstances, students]) => formatTeachingInstanceQueryData(userTeachingInstances, students))
}

/**
 * This methods is not very scalable. Should be redone with more logical database queries.
 */
function formatTeachingInstanceQueryData(userTeachingInstances: Array<Teachinginstance & UsersTeachingInstance>, students: Array<Trafficlight & User>) {
  const courseInstanceMap = new Map<string, Teachinginstance>()
  const studentsMap = new Map<string, ApiStudentObject[]>()

  userTeachingInstances.forEach(row => {
    courseInstanceMap.set(row.coursekey, R.pick(['coursekey', 'courseinfo', 'name', 'startdate', 'enddate', 'coursematerial_name', 'version', 'owner_id'], row))
  })

  students.forEach(({ id, firstname, lastname, coursekey }) => {
    const userExercises = students.filter(({ user_id, coursekey: ck }) => user_id === id && ck === coursekey).map(({ exercise_uuid, status }) => ({ uuid: exercise_uuid, status: String(status) }))
    if (studentsMap.has(coursekey)) {
      studentsMap.get(coursekey).push({ firstname, lastname, exercises: userExercises })
      return
    }
    studentsMap.set(coursekey, [{ firstname, lastname, exercises: userExercises }])
  })

  const apiCourseObject: ApiCourseInstanceObject[] = Array.from(courseInstanceMap.values()).map(courseInstance => ({
    ...courseInstance,
    startdate: String(courseInstance.startdate),
    enddate: String(courseInstance.enddate),
    students: studentsMap.get(courseInstance.coursekey) || [] // empty array for persistance
  }))

  return apiCourseObject
}
