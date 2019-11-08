import express from 'express'
import passport from 'passport'
import helmet from 'helmet'
import OAuth2Strategy from 'passport-oauth2'
import { User } from '@freshbooks/api'
import FreshbooksStrategy from './PassportStrategy'

export default function(
	clientId: string,
	clientSecret: string,
	callbackURL: string,
	verify: OAuth2Strategy.VerifyFunction
): express.Express {
	const app = express()

	// init client params
	app.set('CLIENT_ID', clientId)
	app.set('CLIENT_SECRET', clientSecret)

	// set up middleware
	app.use(helmet())

	// set up auth
	app.use(passport.initialize())

	passport.use(
		'freshbooks',
		new FreshbooksStrategy(clientId, clientSecret, callbackURL, verify)
	)

	passport.serializeUser<User, string>((user, done) => {
		done(null, user.id)
	})
	passport.deserializeUser<User, string>((id: string, done) => {
		done(null, { id, firstName: '', lastName: '' })
	})

	return app
}
