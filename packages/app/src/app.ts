import express from 'express'
import session, { SessionOptions } from 'express-session'
import passport from 'passport'
import helmet from 'helmet'
import OAuth2Strategy, { VerifyCallback } from 'passport-oauth2'
import { Client } from '@freshbooks/api'
import FreshbooksStrategy, { SessionUser } from './PassportStrategy'

const defaultVerifyFn = (clientId: string) => {
	return async (token: string, refreshToken: string, profile: object, done: VerifyCallback): Promise<void> => {
		const client = new Client(token, { clientId })
		try {
			const { data } = await client.users.me()
			if (data !== null && data !== undefined) {
				const user: SessionUser = {
					id: data.id.toString(),
				}
				done(null, user)
			}
		} catch (err) {
			done(err)
		}
	}
}

const defaultSessionOptions: SessionOptions = {
	secret: 'changeme',
	resave: false,
	saveUninitialized: true,
}

const defaultSerializeUserFn = <T extends SessionUser>(user: T, done: (err: any, id?: string) => void): void => {
	done(null, user.id)
}

const defaultDeserializeUserFn = (id: string, done: (err: any, user?: SessionUser) => void): void => {
	done(null, { id })
}

/**
 * Returns an {@link https://expressjs.com/ | ExpressJS} app, pre-configured with FreshBooks API
 *
 * @param clientId - Client ID of application
 * @param clientSecret - Client secret of application
 * @param callbackURL - URL to redirect to, after user authorizes application
 * @param options - App configuration options
 */
export default function (
	clientId: string,
	clientSecret: string,
	callbackURL: string,
	{
		verify,
		sessionOptions = defaultSessionOptions,
		serializeUser = defaultSerializeUserFn,
		deserializeUser = defaultDeserializeUserFn,
	}: Options = {}
): express.Express {
	if (verify == null) {
		verify = defaultVerifyFn(clientId)
	}
	const app = express()

	// init client params
	app.set('CLIENT_ID', clientId)
	app.set('CLIENT_SECRET', clientSecret)

	// set up middleware
	app.use(helmet())
	app.use(session(sessionOptions))

	// set up auth
	passport.serializeUser<SessionUser, string>(serializeUser)
	passport.deserializeUser<SessionUser, string>(deserializeUser)

	app.use(passport.initialize())
	app.use(passport.session())

	passport.use('freshbooks', new FreshbooksStrategy(clientId, clientSecret, callbackURL, verify))

	return app
}

export interface Options {
	verify?: OAuth2Strategy.VerifyFunction
	sessionOptions?: SessionOptions
	serializeUser?: <T extends SessionUser>(user: T, done: (err: any, id?: string) => void) => void
	deserializeUser?: (id: string, done: <T extends SessionUser>(err: any, user?: T) => void) => void
}
