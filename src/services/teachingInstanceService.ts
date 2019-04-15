import database from '../database'
import Teachinginstance from '../models/TeachingInstance'
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
        students: await getStudentList(instance.coursekey) || []
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
        exercises: await getExerciseList(coursekey, student.id) || []
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
