import database from '../database'
import Teachinginstance from '../models/TeachingInstance'
import UsersTeachingInstance from '../models/UsersTeachingInstance'
import Trafficlight from '../models/Trafficlight'
import R from 'ramda'
import User from '../models/User'
import { ApiStudentObject, ApiCourseInstanceObject } from '../types/apiTypes'

export async function findOrCreateTeachinginstance(newTeachingInstance: Teachinginstance): Promise<ApiCourseInstanceObject> {
  const { coursekey } = newTeachingInstance
  const instance: Teachinginstance = await database('teachinginstances')
    .select()
    .where({ coursekey })
    .first()

  if (!instance) {
    await database('teachinginstances').insert(newTeachingInstance)

    const newlyCreatedinstance: Teachinginstance = await database('teachinginstances')
      .select()
      .where({ coursekey })
      .first()

    return {
      ...R.pick(['coursekey', 'name', 'startdate', 'enddate', 'coursematerial_name', 'version', 'owner_id'], newlyCreatedinstance),
      startdate: String(newTeachingInstance.startdate),
      enddate: String(newlyCreatedinstance.enddate),
      students: []
    }
  }

  return {
    ...R.pick(['coursekey', 'name', 'startdate', 'enddate', 'coursematerial_name', 'version', 'owner_id'], instance),
    startdate: String(instance.startdate),
    enddate: String(instance.enddate),
    students: []
  }
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

  const studentsPromise = database('users').leftJoin('trafficlights', 'trafficlights.user_id', '=', 'users.id')

  return Promise.all([userTeachingInstancePromise, studentsPromise]).then(([userTeachingInstances, students]) => formatTeachingInstanceQueryData(userTeachingInstances, students))
}

/**
 * This methods is not very scalable. Should be redone with more logical database queries.
 */
function formatTeachingInstanceQueryData(userTeachingInstances: Array<Teachinginstance & UsersTeachingInstance>, students: Array<Trafficlight & User>) {
  console.log('SUTUEUASUDUASUDUSADU:', students)

  const courseInstanceMap = new Map<string, Teachinginstance>()
  const studentsMap = new Map<string, ApiStudentObject[]>()
  const uidCourseInstanceMap = new Map<number, string[]>()

  userTeachingInstances.forEach(row => {
    courseInstanceMap.set(row.coursekey, R.pick(['coursekey', 'courseinfo', 'name', 'startdate', 'enddate', 'coursematerial_name', 'version', 'owner_id'], row))
    if (uidCourseInstanceMap.has(row.user_id)) {
      uidCourseInstanceMap.get(row.user_id).push(row.course_coursekey)
    } else {
      uidCourseInstanceMap.set(row.user_id, [row.course_coursekey])
    }
  })

  console.log(uidCourseInstanceMap)
  console.log(R.innerJoin((a, b) => a.user_id === b.id, userTeachingInstances, students))

  students.forEach(({ id, firstname, lastname, coursekey }) => {
    const userExercises = students
      .filter(({ user_id, coursekey: ck }) => user_id === id && uidCourseInstanceMap.get(user_id).includes(ck))
      .map(({ exercise_uuid, status }) => ({ uuid: exercise_uuid, status: String(status) }))
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

  console.log('APIDOASDBEBBAS,', apiCourseObject.map(a => a.students))

  return apiCourseObject
}
