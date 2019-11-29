/* eslint-disable import/prefer-default-export */
import { IncludesQueryBuilder } from './IncludesQueryBuilder'
import { SearchQueryBuilder } from './SearchQueryBuilder'

export type QueryBuilderType = IncludesQueryBuilder | SearchQueryBuilder

export const joinQueries = (queryBuilders?: QueryBuilderType[]): string =>
	queryBuilders
		? `?${queryBuilders
				.map(builder => builder.build())
				.join(encodeURIComponent('&'))}`
		: ''
