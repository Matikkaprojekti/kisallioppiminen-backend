export interface UserApiResponse {
  has_sign_in: {
    id: number;
    first_name: string;
    teacher: boolean;
    student: boolean;
  } | null
}

export interface ApiCourseObject {
  id: number
  coursekey: string
  html_id: string
  startdate: string
  enddate: string
  name: string
  students: any[]
}

export interface ApiNewCoursePostObject {
  coursekey: string
  name: string
  html_id: string
  startdate: string
  enddate: string
}

export interface Course {
  coursekey: string
  name: string
  html_id: string
  startdate: Date
  enddate: Date
}

export interface ApiCourseInstanceObject {
  coursekey: string
  coursematerial_name: string
  version: string
  name: string
  startdate: string
  enddate: string
  owner_id: number
  students: ApiStudentObject[]
}

export interface ApiStudentObject {
  firstname: string
  lastname: string
  exercises: Array<{ uuid: string; status: string }>
}
