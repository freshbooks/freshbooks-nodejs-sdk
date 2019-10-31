import Client from '../src/Client'

describe('@freshbooks/api', () => {
	describe('Client', () => {
		test('Default init', () => {
			const token = 'token'
			const client = new Client(token)
			expect(client).not.toBeNull()
		})

		test('Test unauthorized request', async () => {
			const client = new Client('foo')
			const res = await client.users.me()
			expect(res.ok).toBeFalsy()
			expect(res.error).not.toBeUndefined()

			if (res.error) {
				expect(res.error.code).toEqual('unauthenticated')
			}
		})

		test('Test pagination', async () => {
			const client = new Client(
				'af29ed8f8d5d3399791212ce5be512018214b7aebc8d942744a8a45e8177919a'
			)
			const res = await client.invoices.list('xZNQ1X')
			expect(res.ok).toBeTruthy()
			expect(res.data).not.toBeUndefined()

			if (res.data) {
				expect(res.data.pages).not.toBeUndefined()
			}
		})
	})
})
