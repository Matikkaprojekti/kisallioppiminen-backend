import { Router, Request, Response } from 'express'
import passport from 'passport'
import { findOrCreateTeachinginstance, findTeachinginstanceByCoursekey } from '../services/teachingInstanceService'
import { findUserById } from '../services/userService'
import { findOrCreateUsersTeachinginstance } from '../services/usersTeachingInstancesService'

const router: Router = Router()

// Create a teachinginstance
router.post('/', (req: Request, res: Response) => {
  const { coursekey, courseinfo, name, startdate, enddate, coursematerial_name, coursematerial_version } = req.body

  // Check that required params are present
  if (coursekey && coursematerial_name && coursematerial_version && name && startdate && enddate) {
    const result = findOrCreateTeachinginstance(req.body).then(r => res.json(r))
  } else {
    res.status(400)
    res.json({ error: 'Bad request' })
  }
})

// Student join a teachinginstance with the key of the instance.
router.post('/join/:coursekey', async (req: Request, res: Response) => {
  const coursekey = req.params.coursekey
  const { user_id, teacher } = req.body

  console.log(coursekey, user_id, teacher)

  if (coursekey && user_id && teacher !== undefined) {
    console.log('Required params are present.')
    console.log('Checking if coursekey and user_id exists...')

    const user = await findUserById(user_id)
    const teachinginstance = await findTeachinginstanceByCoursekey(coursekey)

    console.log('user ', user)
    console.log('teachinginstance', teachinginstance)
    if (user && teachinginstance) {
      console.log('Lisätään käyttäjä opetusinstanssiin...')

      const newInstances = { user_id, course_coursekey: coursekey, teacher }

      const result = await findOrCreateUsersTeachinginstance(newInstances)

      res.json({ teachinginstance: result })
    } else {
      res.status(400)
      res.send('User or Teachinginstance not found!')
    }
  } else {
    res.status(400)
    res.send('Very BAD request.')
  }
})

export const TeachingInstanceController: Router = router
