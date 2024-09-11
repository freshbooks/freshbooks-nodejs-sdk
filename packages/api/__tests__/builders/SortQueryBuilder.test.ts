/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/camelcase */
import { SortQueryBuilder } from '../../src/models/builders/SortQueryBuilder'
describe('@freshbooks/api', () => {
	describe('SortQueryBuilder', () => {
        test('Verify SortQueryBuilder sort ascending adds correct directional and key parameter and only keep last call', async () => { 
            const query = new SortQueryBuilder().asc('status').asc('name')
            expect(query.queryParam).toEqual(
                { direction: 'asc', key: 'name' }
            )
        });

        test('Verify SortQueryBuilder sort descending adds correct directional and key parameter  and only keep last call', async () => { 
            const query = new SortQueryBuilder().desc('name').desc('status')
            expect(query.queryParam).toEqual(
                { direction: 'desc', key: 'status' }
            )
        });

        test('Verify SortQueryBuilder alias calls correct overload', async () => { 
            const query = new SortQueryBuilder().ascending('status')
            expect(query.queryParam).toEqual(
                { direction: 'asc', key: 'status' }
            )
        });

        test('Verify SortQueryBuilder alias calls correct overload', async () => { 
            const query = new SortQueryBuilder().descending('name')
            expect(query.queryParam).toEqual(
                { direction: 'desc', key: 'name' }
            )
        });

        test('Verify SortQueryBuilder for accounting type endpoints formats ascending correctly', () => {
            const query = new SortQueryBuilder().asc('status').asc('name').build('AccountingResource')
            expect(query).toBe('sort=name_asc')

            const query2 = new SortQueryBuilder().ascending('status').build('EventsResource')
            expect(query2).toBe('sort=status_asc')
        })

        test('Verify SortQueryBuilder for accounting type endpoints formats descending correctly', () => {
            const query = new SortQueryBuilder().desc('status').build('AccountingResource')
            expect(query).toBe('sort=status_desc')

            
            const query2 = new SortQueryBuilder().descending('name').build('EventsResource')
            expect(query2).toBe('sort=name_desc')
        })

        test('Verify SortQueryBuilder for non-accounting type endpoints formats ascending correctly', () => {
            const query = new SortQueryBuilder().asc('status').build('OtherResource')
            expect(query).toBe('sort=-status')
            const query2 = new SortQueryBuilder().ascending('name').build('OtherResource')
            expect(query2).toBe('sort=-name')
        })

        test('Verify SortQueryBuilder for non-accounting type endpoints formats descending correctly', () => {
            const query = new SortQueryBuilder().desc('name').build('OtherResource')
            expect(query).toBe('sort=-name')
            const query2 = new SortQueryBuilder().descending('status').build('OtherResource')
            expect(query2).toBe('sort=-status')
        })

        test('Verify SortQueryBuilder build defaults to accounting type endpoints', () => {
            const query = new SortQueryBuilder().desc('name').build()
            expect(query).toBe('sort=name_desc')
        });
    });
});