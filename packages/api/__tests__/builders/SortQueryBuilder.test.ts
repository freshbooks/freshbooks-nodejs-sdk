/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/camelcase */
import { SortQueryBuilder } from '../../src/models/builders/SortQueryBuilder'
describe('@freshbooks/api', () => {
	describe('SortQueryBuilder', () => {
        test('Verify SortQueryBuilder sort ascending adds correct directional and key parameters', async () => { 
            const query = new SortQueryBuilder().asc('status').asc('name')
            expect(query.queryParams).toEqual([
                { direction: 'asc', key: 'status' },
                { direction: 'asc', key: 'name' },
            ])
        });

        test('Verify SortQueryBuilder sort descending adds correct directional and key parameters', async () => { 
            const query = new SortQueryBuilder().desc('status').desc('name')
            expect(query.queryParams).toEqual([
                { direction: 'desc', key: 'status' },
                { direction: 'desc', key: 'name' },
            ])
        });

        test('Verify SortQueryBuilder alias calls correct overload', async () => { 
            const query = new SortQueryBuilder().ascending('status').ascending('name')
            expect(query.queryParams).toEqual([
                { direction: 'asc', key: 'status' },
                { direction: 'asc', key: 'name' },
            ])
        });

        test('Verify SortQueryBuilder alias calls correct overload', async () => { 
            const query = new SortQueryBuilder().descending('status').descending('name')
            expect(query.queryParams).toEqual([
                { direction: 'desc', key: 'status' },
                { direction: 'desc', key: 'name' },
            ])
        });

        test('Verify SortQueryBuilder for accounting type endpoints formats ascending correctly', () => {
            const query = new SortQueryBuilder().asc('status').asc('name').build('AccountingResource')
            expect(query).toBe('sort=status_asc&sort=name_asc')

            const query2 = new SortQueryBuilder().ascending('status').ascending('name').build('EventsResource')
            expect(query2).toBe('sort=status_asc&sort=name_asc')
        })

        test('Verify SortQueryBuilder for accounting type endpoints formats descending correctly', () => {
            const query = new SortQueryBuilder().desc('status').desc('name').build('AccountingResource')
            expect(query).toBe('sort=status_desc&sort=name_desc')

            
            const query2 = new SortQueryBuilder().descending('status').descending('name').build('EventsResource')
            expect(query2).toBe('sort=status_desc&sort=name_desc')
        })

        test('Verify SortQueryBuilder for non-accounting type endpoints formats ascending correctly', () => {
            const query = new SortQueryBuilder().asc('status').asc('name').build('OtherResource')
            expect(query).toBe('sort=-status&sort=-name')
            const query2 = new SortQueryBuilder().ascending('status').ascending('name').build('OtherResource')
            expect(query2).toBe('sort=-status&sort=-name')
        })

        test('Verify SortQueryBuilder for non-accounting type endpoints formats descending correctly', () => {
            const query = new SortQueryBuilder().desc('status').desc('name').build('OtherResource')
            expect(query).toBe('sort=-status&sort=-name')
            const query2 = new SortQueryBuilder().descending('status').descending('name').build('OtherResource')
            expect(query2).toBe('sort=-status&sort=-name')
        })

        test('Verify SortQueryBuilder build defaults to accounting type endpoints', () => {
            const query = new SortQueryBuilder().asc('status').desc('name').build()
            expect(query).toBe('sort=status_asc&sort=name_desc')
        });
    });
});