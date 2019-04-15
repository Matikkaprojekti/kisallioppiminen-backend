enum StatusOptions {
  green,
  yellow,
  red
}

export default interface Trafficlight {
  uuid: string
  coursekey: string
  status: StatusOptions
  user_id: number
}
