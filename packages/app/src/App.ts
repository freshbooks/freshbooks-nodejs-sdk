import express from 'express'
import passport from 'passport'
import helmet from 'helmet'
import morgan from 'morgan'
import OAuth2Strategy from 'passport-oauth2'
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
	app.use(morgan(process.env.NODE_ENV !== 'production' ? 'dev' : 'common'))

	// set up auth
	passport.use(
		'freshbooks',
		new FreshbooksStrategy(clientId, clientSecret, callbackURL, verify)
	)

	const router = express.Router()
	router.use('/redirect', passport.authenticate('freshbooks'))

	app.use('/auth/freshbooks', router)

	return app
}
