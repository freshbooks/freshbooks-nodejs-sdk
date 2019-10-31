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
				'14e5829e705971582c1c1f2d9bf5546fd815f3c5948eb771e6800cc417e5f54a'
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
