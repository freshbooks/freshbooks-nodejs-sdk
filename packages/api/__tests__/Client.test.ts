import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Client from '../src/Client'

const mock = new MockAdapter(axios) // set mock adapter on default axios instance

describe('@freshbooks/api', () => {
	describe('Client', () => {
		test('Default init', () => {
			const token = 'token'
			const client = new Client(token)
			expect(client).not.toBeNull()
		})

		test('Test unauthorized request', async () => {
			mock
				.onGet('/auth/api/v1/users/me')
				.replyOnce(
					401,
					'{"error":"unauthenticated","error_description":"This action requires authentication to continue."}'
				)

			const client = new Client('foo')
			const res = await client.users.me()

			expect(res.ok).toBeFalsy()
			expect(res.error).not.toBeUndefined()

			if (res.error) {
				expect(res.error.code).toEqual('unauthenticated')
			}
		})

		test('Test pagination', async () => {
			const accountId = 'xZNQ1X'
			mock
				.onGet(`/accounting/account/${accountId}/invoices/invoices`)
				.replyOnce(
					200,
					'{"response":{"result":{"invoices": [],"page": 1,"pages": 1,"per_page": 15,"total": 7}}}'
				)

			const client = new Client('foo')
			const res = await client.invoices.list('xZNQ1X')
			expect(res.ok).toBeTruthy()
			expect(res.data).not.toBeUndefined()

			if (res.data) {
				expect(res.data.pages).not.toBeUndefined()
			}
		})
	})
})
