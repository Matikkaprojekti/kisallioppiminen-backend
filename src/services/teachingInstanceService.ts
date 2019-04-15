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
} /*
function formatTeachingInstanceQueryData(userTeachingInstances: Array<Teachinginstance & UsersTeachingInstance>, students: Array<User & Trafficlight>) {
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
*/ // tslint:disable-next-line

// tslint:disable-next-line
/*
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

// tslint:disable-next-line
export async function findTeachingInstancesByOwnerId(owner_id: number) {
  const usersInstances: Teachinginstance[] = await database('teachinginstances')
    .select()
    .where({ owner_id })

  console.log('Näillä kursseilla olet opettajana: ', usersInstances)

  return Promise.all(
    Array.from(
      usersInstances.map(async instance => ({
        ...instance,
        startdate: String(instance.startdate),
        enddate: String(instance.enddate),
        students: await getStudentList(instance.coursekey)
      }))
    )
  )

  async function getStudentList(coursekey: string) {
    const studentlist = await database('usersteachinginstances')
      .select('firstname', 'lastname', 'id')
      .where({ course_coursekey: coursekey })
      .leftJoin('users', 'user_id', '=', 'users.id')

    console.log('Tällä kurssilla on seuraavat opiskelijat:', studentlist)

    const result = await studentlist.map(async (student: any) => {
      return await {
        firstname: student.firstname,
        lastname: student.lastname,
        exercises: await getExerciseList(coursekey, student.id)
      }
    })

    async function getExerciseList(coursekey: string, id: number) {
      const exerciselist = await database('trafficlights')
        .select('uuid', 'status')
        .where({ coursekey, user_id: id })

      console.log('tehtavalista:', exerciselist)
      return exerciselist
    }

    console.log('Tässä on lista kurssin opiskelijoista, tehtävineen:', result)
    return Promise.all(result)
  }
}

/*
  const instanceWithStudents: ApiCourseInstanceObject[] = usersInstances.map(instance => {
    const studentlist = await database('usersteachinginstances')
      .select('user_id')
      .where('course_coursekey', '=', instance.coursekey)
      .leftJoin('users', 'user_id', '=', 'users.id')

    instance.students = studentlist.map(student => {
      const formattedStudent = {
        firstname = student.firstname
        lastname = student.lastname
        exercises = []
      }
      return formattedStudent
    })
  })
*/
