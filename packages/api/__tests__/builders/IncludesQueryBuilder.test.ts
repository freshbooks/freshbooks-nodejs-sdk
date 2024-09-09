/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/camelcase */
import { IncludesQueryBuilder } from '../../src/models/builders/IncludesQueryBuilder'

describe('@freshbooks/api', () => {
    describe('IncludesQueryBuilder', () => {
        test('Verify IncludesQueryBuilder', async () => {
            const includes = new IncludesQueryBuilder().includes('client')
            expect(includes.queryParams).toEqual({ 'include[]': ['client'] })
        })

        test('Verify IncludesQueryBuilder with multiple includes', async () => {
            const includes = new IncludesQueryBuilder().includes('client').includes('contacts')
            expect(includes.queryParams).toEqual({ 'include[]': ['client', 'contacts'] })
        })
    })
})