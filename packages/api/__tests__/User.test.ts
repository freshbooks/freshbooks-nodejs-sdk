import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Client from '../src/Client'

const mock = new MockAdapter(axios) // set mock adapter on default axios instance

describe('@freshbooks/api', () => {
	describe('User', () => {
		test('GET /users/me', async () => {
			const token = 'token'
			const client = new Client(token)

			mock
				.onGet(`/auth/api/v1/users/me`)
				.replyOnce(200, '{"response":{"id":"123"}}')

			const response = await client.users.me()
			const user = response.data
			expect(user.id).toEqual('123')
		})
	})
})
