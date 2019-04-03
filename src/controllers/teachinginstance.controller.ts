import { Router, Request, Response } from 'express'
import passport from 'passport'
import { findOrCreateTeachinginstance, findTeachinginstanceByCoursekey, findTeachingInstancesByOwnerId } from '../services/teachingInstanceService'
import { findUserById } from '../services/userService'
import { findOrCreateUsersTeachinginstance, findTeachingInstancesWithUserId, findTeachingInstanceWithUserIdAndCoursekey } from '../services/usersTeachingInstancesService'

const router: Router = Router()

// Create a teachinginstance
router.post('/', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  console.log('asdasdadsdasda')
  const { user } = req
  const { coursekey, name, startdate, enddate, coursematerial_name, version } = req.body

  if (!user) {
    return res.status(401).json({ error: 'unauthorized' })
  }

  // tslint:disable-next-line
  const owner_id = user.id;

  console.log('owner_id', owner_id)

  // Check that required params are present
  // asddsa
  if (coursekey && coursematerial_name && version && name && startdate && enddate && owner_id) {
    const result = findOrCreateTeachinginstance({
      ...req.body,
      owner_id
    }).then(r => res.json(r))
  } else {
    res.status(400)
    res.json({ error: 'Bad request' })
  }
})

// Student join a teachinginstance with the key of the instance.
// jotain
router.patch('/', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  const { user } = req
  const coursekey = req.body.coursekey

  console.log('Trimmed coursekey', coursekey)

  if (coursekey !== undefined) {
    console.log('Required params are present.')
    console.log('Checking if coursekey and user_id exists...')

    const teachinginstance = await findTeachinginstanceByCoursekey(coursekey)
    await console.log('teachinginstance: ', teachinginstance)

    console.log('user ', user)
    console.log('teachinginstance', teachinginstance)
    if (user && teachinginstance) {
      console.log('Lisätään käyttäjä opetusinstanssiin...')
      const newInstances = { user_id: user.id, course_coursekey: coursekey }
      await findOrCreateUsersTeachinginstance(newInstances)
      const result = await findTeachingInstanceWithUserIdAndCoursekey(user.id, coursekey)

      const result3 = {
        coursekey: newInstances.course_coursekey,
        coursematerial_name: result.coursematerial_name,
        version: result.version,
        name: result.name,
        startdate: result.startdate,
        enddate: result.enddate,
        owner_id: result.owner_id,
        students: [
          {
            firstname: user.firstname,
            lastname: user.lastname,
            exercises: [{}]
          }
        ]
      }

      console.log('result alkaa tästä:')
      console.log(result3)
      res.json(result3)
    } else if (!user) {
      console.log('no user')
      res.status(400)
      res.send('User not found!')
    } else if (!teachinginstance) {
      console.log('no teachingInstance')
      res.status(400)
      res.send('Teachinginstance not found!')
    } else {
      console.log('Nolla nothing')
      res.status(400)
      res.send('No user and teachinginstance found')
    }
  } else {
    res.status(400)
    res.send('Very BAD request.')
  }
})

router.get('/:teacher', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { user } = req
  // Check if auth
  if (!user) {
    return res.status(401).json({ error: 'unauthorized' })
  }

  // Check that required params are present
  const teacher = req.params.teacher
  if (teacher !== 'true' && teacher !== 'false') {
    return res.status(400).json({ error: 'Path param teacher is not valid.' })
  }

  // Set boolean value isTeacher
  let isTeacher = false
  if (teacher === 'true') {
    isTeacher = true
  }

  if (isTeacher) {
    res.json(await findTeachingInstancesByOwnerId(user.id))
  } else {
    res.json(await findTeachingInstancesWithUserId(user.id))
  }
})

export const TeachingInstanceController: Router = router
