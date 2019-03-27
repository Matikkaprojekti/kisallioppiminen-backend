import database from '../database'
import User from '../models/User'

export async function findOrCreateUser({ googleId, firstname, lastname }: { googleId: number; firstname: string, lastname: string }): Promise<User> {
  const user = await database('users')
    .select()
    .where({ googleid: googleId })
    .first()

  if (!user) {
    const userId = await database('users').insert({ googleid: googleId, name: firstname, firstname, lastname }, 'id')
    return {
      id: userId[0],
      name: firstname,
      googleid: googleId,
      firstname,
      lastname
    }
  }

  return user
}

export async function findUserById(id: number): Promise<User | null> {
  const user = await database('users')
    .select('*')
    .where({ id })
    .first()

  if (user) {
    return user
  } else {
    return undefined
  }
}
