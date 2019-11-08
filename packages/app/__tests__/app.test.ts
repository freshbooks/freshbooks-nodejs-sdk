import request from 'supertest'
import passport from 'passport'
import createApp from '../src/app'
import { AUTHORIZATION_URL } from '../src/PassportStrategy'

const CLIENT_ID = 'client_id'
const CLIENT_SECRET = 'client_secret'
const CALLBACK_URL = 'https://freshbooks.app/auth/freshbooks/redirect'

describe('@freshbooks/app', () => {
	describe('App', () => {
		test('GET /', async () => {
			const app = createApp(CLIENT_ID, CLIENT_SECRET, CALLBACK_URL)
			const response = await request(app).get('/')
			expect(response.status).toBe(404)
		})
	})

	describe('Auth', () => {
		test('GET /auth/freshbooks', async () => {
			const app = createApp(CLIENT_ID, CLIENT_SECRET, CALLBACK_URL)

			// setup route
			app.get(
				'/auth/freshbooks',
				passport.authenticate('freshbooks', {
					successRedirect: '/success',
					failureRedirect: '/failure',
				})
			)

			const response = await request(app).get('/auth/freshbooks')
			const {
				header: { location },
				status,
			} = response

			expect(status).toBe(302)
			expect(location.startsWith(AUTHORIZATION_URL)).toBeTruthy()
		})
	})
})
