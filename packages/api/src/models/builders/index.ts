/* eslint-disable import/prefer-default-export */
import { IncludesQueryBuilder } from './IncludesQueryBuilder'
import { SearchQueryBuilder } from './SearchQueryBuilder'
import { PaginationQueryBuilder } from './PaginationQueryBuilder'
import { SortQueryBuilder } from './SortQueryBuilder'

export type QueryBuilderType = IncludesQueryBuilder | SearchQueryBuilder | PaginationQueryBuilder | SortQueryBuilder
export { IncludesQueryBuilder }
export { SearchQueryBuilder }
export { PaginationQueryBuilder }
export { SortQueryBuilder }

export const joinQueries = (queryBuilders?: QueryBuilderType[], resourceType?: string): string =>
	queryBuilders ? `?${queryBuilders.map((builder) => builder.build(resourceType)).join('&')}` : ''
