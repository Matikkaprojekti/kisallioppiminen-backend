enum StatusOptions {
  green,
  yellow,
  red
}

export default interface Trafficlight {
  exercise_uuid: string
  coursekey: string
  status: StatusOptions
  user_id: number
}
