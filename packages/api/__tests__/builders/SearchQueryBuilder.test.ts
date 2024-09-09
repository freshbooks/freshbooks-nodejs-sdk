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
	
        
        test('Verify SearchQueryBuilder between', async () => {
            const query = new SearchQueryBuilder().between('date', {'min': '2020-01-01','max': '2020-01-31'})

            expect(query.queryParams).toEqual([
                { type: 'between', key: 'date_min', value: '2020-01-01' },
                { type: 'between', key: 'date_max', value: '2020-01-31' },
            ])
        })
    
        
        test('Verify SearchQueryBuilder in', async () => {
            const query = new SearchQueryBuilder().in('status', ['active', 'inactive'])

            expect(query.queryParams).toEqual([
                { type: 'in', key: 'status', value: ['active', 'inactive'] },
            ])
        })
  
        test('Verify SearchQueryBuilder like', async () => {
            const query = new SearchQueryBuilder().like('name', 'test')

            expect(query.queryParams).toEqual([
                { type: 'like', key: 'name', value: 'test' },
            ])
        })
    
        test('Verify SearchQueryBuilder date between', async () => {
            const minDate = new Date('2020-01-01')
            const maxDate = new Date('2020-01-31')
            const minMonth = minDate.toLocaleDateString(undefined, { month: '2-digit' })
            const minDay = minDate.toLocaleDateString(undefined, {  day: '2-digit' })
            const minYear = minDate.getFullYear()
            
            const maxMonth = maxDate.toLocaleDateString(undefined, { month: '2-digit' })
            const maxDay = maxDate.toLocaleDateString(undefined, {  day: '2-digit' })
            const maxYear = maxDate.getFullYear()

            const minFormatted = `${minYear}-${minMonth}-${minDay}`
            const maxFormatted = `${maxYear}-${maxMonth}-${maxDay}`

            const query = new SearchQueryBuilder().between('date', {'min': minDate,'max': maxDate})

            // The dates are off because of timezone conversion
            expect(query.queryParams).toEqual([
                { type: 'between', key: 'date_min', value: minFormatted },
                { type: 'between', key: 'date_max', value: maxFormatted },
            ])
        })
    })
})
