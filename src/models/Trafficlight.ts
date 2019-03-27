enum statusOptions {
  green,
  yellow,
  red
}

export default interface Trafficlight {
  exercise_uuid: string
  coursekey: string
  status: statusOptions
  user_id: string
}
