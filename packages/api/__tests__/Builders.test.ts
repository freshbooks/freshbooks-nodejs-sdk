import { IncludesQueryBuilder } from '../src/models/builders/IncludesQueryBuilder'
import { SearchQueryBuilder } from '../src/models/builders/SearchQueryBuilder'

describe('@freshbooks/api', () => {
	describe('Accounting Endpoint Builders', () => {
		test('IncludesQueryBuilder', () => {
			const builder = new IncludesQueryBuilder()
				.includes('lines')
				.includes('direct_links')
			const expected = 'include[]=lines&include[]=direct_links'
			expect(builder.build()).toEqual(expected)
		})
		test('SearchQueryBuilder', () => {
			const result = new SearchQueryBuilder()
				.like('address', '21 Peter Street')
				.equals('userid', 1234)
				.in('userids', [1, 2, 3, 4])
				.between('updated', {
					min: new Date('January 1, 2000'),
					max: new Date('December 15, 2015'),
				})
				.build()
			const expected =
				'search[address_like]=21+Peter+Street&search[userid]=1234&search[userids]=1&search[userids]=2&search[userids]=3&search[userids]=4&search[updated_min]=2000-01-01&search[updated_max]=2015-12-15'
			expect(result).toEqual(expected)
		})
	})
})
