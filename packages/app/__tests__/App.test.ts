import request from 'supertest'
import app from '../src/App'

describe('@freshbooks/app', () => {
	describe('App', () => {
		test('GET /', async () => {
			const response = await request(app).get('/')
			expect(response.status).toBe(404)
		})
	})
})
