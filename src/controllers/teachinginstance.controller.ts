import { Router, Request, Response } from 'express'
import passport from 'passport'
import { findOrCreateTeachinginstance, findTeachinginstanceByCoursekey, findTeachingInstancesByOwnerId, deleteTeachingInstanceByCoursekey, findTeacherIdByCoursekey } from '../services/teachingInstanceService'
import {
  findOrCreateUsersTeachinginstance,
  findTeachingInstancesWithUserId,
  findTeachingInstanceWithUserIdAndCoursekey,
  removeTeachingInstanceWithUserIdAndCoursekey,
  isUserAlreadyInCourse
} from '../services/usersTeachingInstancesService'
import { findTrafficlightsByUserIdAndCoursekey } from '../services/trafficlightService'

const router: Router = Router()

// Create a teachinginstance
router.post('/', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  const { user } = req
  const { coursekey, name, startdate, enddate, coursematerial_name, version } = req.body

  if (!user) {
    return res.status(401).json({ error: 'unauthorized' })
  }

  const owner_id = user.id

  // Check that required params are present
  if (coursekey && coursematerial_name && version && name && startdate && enddate && owner_id) {
    const result = findOrCreateTeachinginstance({
      ...req.body,
      owner_id
    }).then(r => {
      if (r === undefined) {
        res.status(400).json({ error: 'Kurssiavain on jo olemassa!' })
      } else {
        res.json(r)
      }
    })
  } else {
    res.status(400)
    res.json({ error: 'Virheellinen pyyntö!' })
  }
})

router.get('/:teacher', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { user } = req
  if (!user) {
    return res.status(401).json({ error: 'unauthorized' })
  }

  // Check that required params are present //Path param teacher is not valid
  const teacher = req.params.teacher
  if (teacher !== 'true' && teacher !== 'false') {
    return res.status(400).json({ error: 'Virheelliset opettajan tiedot.' })
  }

  // Set boolean value isTeacher
  const isTeacher = teacher === 'true'
  if (isTeacher) {
    res.json(await findTeachingInstancesByOwnerId(user.id))
  } else {
    const result = await findTeachingInstancesWithUserId(user.id)
    res.json(result)
  }
})

// Student join a teachinginstance with the key of the instance.
router.patch('/', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  const { user } = req
  if (!req.body.coursekey) {
    res.status(400).json({ error: 'Kurssiavain puuttuu' })
  }
  const coursekey = req.body.coursekey.toLowerCase()

  if (coursekey !== undefined) {
    const teachinginstance = await findTeachinginstanceByCoursekey(coursekey)

    if (user && teachinginstance) {
      const isUserInCourse = await isUserAlreadyInCourse(user.id, coursekey)
      if (isUserInCourse) {
        return res.status(403).json({ error: 'Käyttäjä on jo kurssilla' })
      }
      const newInstances = { user_id: user.id, course_coursekey: coursekey }
      await findOrCreateUsersTeachinginstance(newInstances)
      const teachingInstance = await findTeachingInstanceWithUserIdAndCoursekey(user.id, coursekey)

      const result = {
        coursekey: newInstances.course_coursekey,
        coursematerial_name: teachingInstance.coursematerial_name,
        version: teachingInstance.version,
        name: teachingInstance.name,
        startdate: teachingInstance.startdate,
        enddate: teachingInstance.enddate,
        owner_id: teachingInstance.owner_id,
        students: [
          {
            firstname: user.firstname,
            lastname: user.lastname,
            exercises: await findTrafficlightsByUserIdAndCoursekey(user.id, coursekey)
          }
        ]
      }

      res.json(result)
    } else if (!user) {
      res.status(401).json({ error: 'Luvaton pyyntö' })
    } else if (!teachinginstance) {
      res.status(400).json({ error: 'Kurssia ei löydy' })
    } else {
      res.status(400).json({ error: 'Käyttäjää tai kurssia ei löytynyt' })
    }
  } else {
    res.status(400).json({ error: 'Virheellinen pyyntö!' })
  }
})

router.delete('/:coursekey/:teacher', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  const { user } = req
  if (!user) {
    return res.status(401).json({ error: 'unauthorized' })
  }

  // Check that 'teacher' parameter is properly given
  const teacher = req.params.teacher
  if (teacher !== 'true' && teacher !== 'false') {
    return res.status(400).json({ error: 'Virheelliset roolitiedot.' })
  }

  const coursekey = req.params.coursekey.toLowerCase()

  if (teacher === 'true') {
    const teacherId = findTeacherIdByCoursekey(coursekey)
    if (teacherId !== user.id) {
      return res.status(401).json({ error: 'unauthorized' })
    }
    try {
      await deleteTeachingInstanceByCoursekey(coursekey)
      return res.json({ message: 'Opetusinstanssin tiedot poistettu.' })
    } catch (error) {
      return res.status(404).json({ error: 'Virheellinen pyyntö!' })
    }
  }

  try {
    await removeTeachingInstanceWithUserIdAndCoursekey(user.id, coursekey)
    return res.json({ message: 'Päivitys valmis.' })
  } catch (error) {
    await res.status(404).json({ error: 'Virheellinen pyyntö!' })
  }
})

export const TeachingInstanceController: Router = router
