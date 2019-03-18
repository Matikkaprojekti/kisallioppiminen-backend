import { Router, Request, Response } from 'express'
import passport from 'passport'
import { findOrCreate } from '../services/teachingInstanceService'

const router: Router = Router()

// Create a teachinginstance
router.post('/', (req: Request, res: Response) => {
  const { coursekey, courseinfo, name, startdate, enddate, coursematerial_name, coursematerial_version } = req.body

  // Check that required params are present
  if (coursekey && coursematerial_name && coursematerial_version && name && startdate && enddate) {
    const result = findOrCreate(req.body).then(r => res.json(r))
  } else {
    res.json({ error: 'Some requestparams are missing...' })
  }
})

export const TeachingInstanceController: Router = router
