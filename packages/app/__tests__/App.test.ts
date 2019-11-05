import request from 'supertest'
import createApp from '../src/app'
import { AUTHORIZATION_URL } from '../src/PassportStrategy'

const CLIENT_ID = 'client_id'
const CLIENT_SECRET = 'client_secret'
const CALLBACK_URL = 'https://freshbooks.app/auth/freshbooks/redirect'

const verify = (): void => {}

describe('@freshbooks/app', () => {
	describe('App', () => {
		test('GET /', async () => {
			const app = createApp(CLIENT_ID, CLIENT_SECRET, CALLBACK_URL, verify)
			const response = await request(app).get('/')
			expect(response.status).toBe(404)
		})
	})

	describe('Auth', () => {
		test('GET /auth/freshbooks', async () => {
			const app = createApp(CLIENT_ID, CLIENT_SECRET, CALLBACK_URL, verify)
			const response = await request(app).get('/auth/freshbooks')

			expect(response.status).toBe(302)

			const { location } = response.header
			expect(location.startsWith(AUTHORIZATION_URL)).toBeTruthy()
		})
	})
})
