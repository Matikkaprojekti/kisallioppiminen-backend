const GoogleStrategy = require("passport-google-oauth20"); // tslint:disable-line
import User from './models/User'
import passport from 'passport'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import { findOrCreateUser, findUserById } from './services/userService'

export const passportInitializer = (app: any) => {
  app.use(passport.initialize())
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${
          process.env.NODE_ENV === 'dev'
            ? 'http://localhost:8000'
            : process.env.PROD_URL
        }/users/auth/callback`
      },
      (
        accessToken: any,
        refreshToken: any,
        profile: {
          id: number;
          name: { familyName: string; givenName: string; lastname: string };
        },
        cb: any
      ) => {
        findOrCreateUser({
          googleId: profile.id,
          firstname: profile.name.givenName,
          lastname: profile.name.familyName
        })
          .then((result: any) => {
            return cb(null, result)
          })
          .catch((e: any) => {
            return cb(e, null)
          })
      }
    )
  )
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
      },
      ({ userId }, done) => {
        findUserById(userId)
          .then(user => {
            done(null, user)
          })
          .catch(e => {
            done(e, null)
          })
      }
    )
  )

  passport.serializeUser(({ id }: User, done: any) => {
    console.log('serializee')
    done(null, id)
  })

  passport.deserializeUser((id: number, done: any) => {
    console.log('deserializee')
    findUserById(id).then((user: any) => {
      if (!user) {
        return done(new Error('Unauthorized'), null)
      }
      done(null, user)
    })
  })
}
