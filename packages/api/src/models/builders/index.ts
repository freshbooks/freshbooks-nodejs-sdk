/* eslint-disable import/prefer-default-export */
import { IncludesQueryBuilder } from './IncludesQueryBuilder'
import { SearchQueryBuilder } from './SearchQueryBuilder'
import { PaginationQueryBuilder } from './PaginationQueryBuilder'

export type QueryBuilderType =
	| IncludesQueryBuilder
	| SearchQueryBuilder
	| PaginationQueryBuilder

export const joinQueries = (queryBuilders?: QueryBuilderType[]): string =>
	queryBuilders
		? `?${queryBuilders.map(builder => builder.build()).join('&')}`
		: ''
