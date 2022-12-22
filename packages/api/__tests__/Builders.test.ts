import { IncludesQueryBuilder } from '../src/models/builders/IncludesQueryBuilder'
import { SearchQueryBuilder } from '../src/models/builders/SearchQueryBuilder'
import { PaginationQueryBuilder } from '../src/models/builders/PaginationQueryBuilder'
import { joinQueries } from '../src/models/builders'

describe('@freshbooks/api', () => {
	describe('Accounting Endpoint Builders', () => {
		test('IncludesQueryBuilder', () => {
			const builder = new IncludesQueryBuilder().includes('lines').includes('direct_links')
			const expected = 'include[]=lines&include[]=direct_links'

			expect(builder.build()).toEqual(expected)
		})
		test('SearchQueryBuilder - No parameter defaults to accountingLike', () => {
			const result = new SearchQueryBuilder()
				.like('address_like', '21 Peter Street')
				.equals('userid', 1234)
				.in('userids', [1, 2, 3, 4])
				.between('updated', {
					min: new Date('January 1, 2000'),
					max: new Date('December 15, 2015'),
				})
				.build()
			const expected =
				'search[address_like]=21 Peter Street&search[userid]=1234&search[userids][]=1&search[userids][]=2&search[userids][]=3&search[userids][]=4&search[updated_min]=2000-01-01&search[updated_max]=2015-12-15'

			expect(result).toEqual(expected)
		})
		test('SearchQueryBuilder - AccountingLike', () => {
			const result = new SearchQueryBuilder()
				.like('address_like', '21 Peter Street')
				.equals('userid', 1234)
				.in('userids', [1, 2, 3, 4])
				.between('updated', {
					min: new Date('January 1, 2000'),
					max: new Date('December 15, 2015'),
				})
				.build('AccountingResource')
			const expected =
				'search[address_like]=21 Peter Street&search[userid]=1234&search[userids][]=1&search[userids][]=2&search[userids][]=3&search[userids][]=4&search[updated_min]=2000-01-01&search[updated_max]=2015-12-15'

			expect(result).toEqual(expected)
		})
		test('SearchQueryBuilder - ProjectLike', () => {
			const result = new SearchQueryBuilder().equals('userid', 1234).build('ProjectResource')
			const expected = 'userid=1234'
			expect(result).toEqual(expected)
		})
		test('SearchQueryBuilder - Between options', () => {
			const result = new SearchQueryBuilder()
				.between('updated', {
					min: new Date('January 1, 2000'),
					max: new Date('December 15, 2015'),
				})
				.between('created', {
					min: '2000-01-01',
				})
				.between('due_date', {
					max: '2015-12-15',
				})
				.build()
			const expected =
				'search[updated_min]=2000-01-01&search[updated_max]=2015-12-15&search[created_min]=2000-01-01&search[due_date_max]=2015-12-15'

			expect(result).toEqual(expected)
		})
		test('PaginationQueryBuilder', () => {
			const result = new PaginationQueryBuilder().page('10').perPage('20').build()
			const expected = 'page=10&per_page=20'
			expect(result).toEqual(expected)
		})
		test('joinQueries', () => {
			const searchBuilder = new SearchQueryBuilder().like('address_like', '21 Peter Street').equals('userid', 1234)
			const includesBuilder = new IncludesQueryBuilder().includes('lines').includes('direct_links')

			const result = joinQueries([searchBuilder, includesBuilder])

			const expected =
				'?search[address_like]=21 Peter Street&search[userid]=1234&include[]=lines&include[]=direct_links'
			expect(result).toEqual(expected)
		})
	})
})
