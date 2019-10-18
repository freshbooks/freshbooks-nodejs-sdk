import EventAdapter from '../src/EventAdapter'

describe('@freshbooks/events', () => {
	describe('EventAdapter', () => {
		test('Default init', () => {
			const secret = 'secret'
			const adapter = new EventAdapter(secret)
			expect(adapter).not.toBeNull()
			expect(adapter.secret).toEqual(secret)
		})
	})
})
