/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/camelcase */
import { PaginationQueryBuilder } from '../../src/models/builders/PaginationQueryBuilder'

describe('@freshbooks/api', () => {
    describe('PaginationQueryBuilder', () => {
        test('Verify PaginationQueryBuilder page', async () => {
            const paginationQueryBuilder = new PaginationQueryBuilder()
            paginationQueryBuilder.page(1)
            expect(paginationQueryBuilder.queryParams).toEqual({ page: 1 })
        })

        test('Verify PaginationQueryBuilder perPage', async () => {
            const paginationQueryBuilder = new PaginationQueryBuilder()
            paginationQueryBuilder.perPage(10)
            expect(paginationQueryBuilder.queryParams).toEqual({ per_page: 10 })
        })
    })
})