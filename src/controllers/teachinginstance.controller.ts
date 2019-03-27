import { Router, Request, Response } from 'express'
import passport from 'passport'
import { findOrCreateTeachinginstance, findTeachinginstanceByCoursekey } from '../services/teachingInstanceService'
import { findUserById } from '../services/userService'
import { findOrCreateUsersTeachinginstance, findTeachingInstancesWithUserId } from '../services/usersTeachingInstancesService'

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
router.patch('/', passport.authenticate('jwt', {session: false}), async (req: Request, res: Response) => {
  const { user } = req
  const { coursekey } = req.body

  console.log(coursekey)

  if (coursekey !== undefined) {
    console.log('Required params are present.')
    console.log('Checking if coursekey and user_id exists...')

    const teachinginstance = await findTeachinginstanceByCoursekey(coursekey)

    console.log('user ', user)
    console.log('teachinginstance', teachinginstance)
    if (user && teachinginstance) {
      console.log('Lisätään käyttäjä opetusinstanssiin...')
      const newInstances = { user_id: user.id, course_coursekey: coursekey }
      const result = await findOrCreateUsersTeachinginstance(newInstances)

      res.json(result)
    } else {
      res.status(400)
      res.send('User or Teachinginstance not found!')
    }
  } else {
    res.status(400)
    res.send('Very BAD request.')
  }
})

router.get('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
  const { user } = req

  if (!user) {
    return res
      .status(401)
      .json({error: 'unauthorized'})
  }

  res.json(await findTeachingInstancesWithUserId(user.id))
})

export const TeachingInstanceController: Router = router
