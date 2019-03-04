import database from '../database'
import User from '../models/User'

export async function findOrCreate({googleId, name}: {googleId: number, name: string}): Promise<User> {
  const user = await database('users')
    .select()
    .where({googleid: googleId})
    .first()

  if (!user) {
    const userId = await database('users')
      .insert({googleid: googleId, name}, 'id')
    return {
      id: userId,
      googleid: googleId,
      name
    }
  }

  return user
}

export async function findUserById(id: number): Promise<User | null> {
  return database('users')
    .select('*')
    .where({id})
    .first()
}
