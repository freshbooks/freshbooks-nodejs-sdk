import Client from '../src/Client'

describe('@freshbooks/api', () => {
	describe('Client', () => {
		test('Default init', () => {
			const client = new Client()
			expect(client).not.toBeNull()
		})
	})
})
