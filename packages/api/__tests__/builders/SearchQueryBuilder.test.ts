/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/camelcase */
import { SearchQueryBuilder } from '../../src/models/builders/SearchQueryBuilder'

describe('@freshbooks/api', () => {
	describe('SearchQueryBuilder', () => {
		test('Verify SearchQueryBuilder', async () => {
			const query = new SearchQueryBuilder().equals('status', 'active').equals('email', 'test@test.com')

			expect(query.queryParams).toEqual([
				{ type: 'equals', key: 'status', value: 'active' },
				{ type: 'equals', key: 'email', value: 'test@test.com' },
			])
		})
	})
})

describe('@freshbooks/api', () => {
    describe('SearchQueryBuilder', () => {
        test('Verify SearchQueryBuilder between', async () => {
            const query = new SearchQueryBuilder().between('date', {'min': '2020-01-01','max': '2020-01-31'})

            expect(query.queryParams).toEqual([
                { type: 'between', key: 'date_min', value: '2020-01-01' },
                { type: 'between', key: 'date_max', value: '2020-01-31' },
            ])
        })
    })
})

describe('@freshbooks/api', () => {
    describe('SearchQueryBuilder', () => {
        test('Verify SearchQueryBuilder in', async () => {
            const query = new SearchQueryBuilder().in('status', ['active', 'inactive'])

            expect(query.queryParams).toEqual([
                { type: 'in', key: 'status', value: ['active', 'inactive'] },
            ])
        })
    })
})

describe('@freshbooks/api', () => {
    describe('SearchQueryBuilder', () => {
        test('Verify SearchQueryBuilder like', async () => {
            const query = new SearchQueryBuilder().like('name', 'test')

            expect(query.queryParams).toEqual([
                { type: 'like', key: 'name', value: 'test' },
            ])
        })
    })
})

