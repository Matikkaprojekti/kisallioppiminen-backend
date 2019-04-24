import database from '../database'
import Teachinginstance from '../models/TeachingInstance'
import R from 'ramda'
import { ApiStudentObject, ApiCourseInstanceObject } from '../types/apiTypes'

export async function findOrCreateTeachinginstance(newTeachingInstance: Teachinginstance): Promise<ApiCourseInstanceObject> {
  const { coursekey } = newTeachingInstance
  const instance: Teachinginstance = await database('teachinginstances')
    .select()
    .where({ coursekey })
    .first()

  if (!instance) {
    // Make coursekey lowercase!
    newTeachingInstance.coursekey = newTeachingInstance.coursekey.toLowerCase()

    await database('teachinginstances').insert(newTeachingInstance)

    const newlyCreatedinstance: Teachinginstance = await database('teachinginstances')
      .select()
      .where({ coursekey: newTeachingInstance.coursekey })
      .first()

    return {
      ...R.pick(['coursekey', 'name', 'startdate', 'enddate', 'coursematerial_name', 'version', 'owner_id'], newlyCreatedinstance),
      startdate: String(newTeachingInstance.startdate),
      enddate: String(newlyCreatedinstance.enddate),
      students: []
    }
  } else {
    // Jos kurssiavain on jo käytetty, palautetaan undefined, jolloin responsessa palautetaan error.
    return undefined
  }
}

export async function findTeachinginstanceByCoursekey(coursekey: string): Promise<Teachinginstance> {
  return await database('teachinginstances')
    .select('*')
    .where({ coursekey })
    .first()
}

// tslint:disable-next-line
export async function findTeachingInstancesByOwnerId(owner_id: number): Promise<ApiCourseInstanceObject[]> {
  const usersInstances: Teachinginstance[] = await database('teachinginstances')
    .select()
    .where({ owner_id })

  return Promise.all(
    Array.from(
      usersInstances.map(async instance => ({
        ...instance,
        startdate: String(instance.startdate),
        enddate: String(instance.enddate),
        students: (await getStudentList(instance.coursekey)) || []
      }))
    )
  )

  async function getStudentList(coursekey: string): Promise<ApiStudentObject[]> {
    const studentlist: Array<{ firstname: string; lastname: string; id: number }> = await database('usersteachinginstances')
      .select('firstname', 'lastname', 'id')
      .where({ course_coursekey: coursekey })
      .leftJoin('users', 'user_id', '=', 'users.id')

    const result: Array<Promise<ApiStudentObject>> = await studentlist.map(async (student: { firstname: string; lastname: string; id: number }) => {
      return {
        firstname: student.firstname,
        lastname: student.lastname,
        exercises: (await getExerciseList(coursekey, student.id)) || []
      }
    })

    async function getExerciseList(coursekey: string, id: number): Promise<Array<{ uuid: string; status: string }>> {
      const exerciselist: Promise<Array<{ uuid: string; status: string }>> = await database('trafficlights')
        .select('uuid', 'status')
        .where({ coursekey, user_id: id })

      return exerciselist
    }

    return Promise.all(result)
  }
}
