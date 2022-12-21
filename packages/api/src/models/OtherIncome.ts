/* eslint-disable @typescript-eslint/camelcase */
import Pagination from './Pagination'
import { transformErrorResponse, isAccountingErrorResponse, ErrorResponse } from './Error'
import Money, { transformMoneyParsedResponse } from './Money'
import Tax, { transformTaxParsedResponse, transformTaxRequest } from './Tax'
import { transformDateResponse, DateFormat, transformDateRequest } from './Date'

enum CategoryName {
	advertising = 'advertising',
	in_person_sales = 'in_person_sales',
	online_sales = 'online_sales',
	rentals = 'rentals',
	other = 'other',
}
enum VisState {
	active,
	deleted,
	archived,
}

export default interface OtherIncome {
	incomeId?: string
	amount?: Money
	categoryName?: CategoryName
	createdAt?: Date
	date?: Date
	note?: Text
	paymentType: string
	source?: string
	taxes?: Tax[]
	updatedAt?: Date
	visState?: VisState
}

export function transformOtherIncomeResponse(data: string): OtherIncome | ErrorResponse {
	const response = JSON.parse(data)
	
	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { other_income } = response.response.result

	return transformOtherIncomeParsedResponse(other_income)
}

export function transformOtherIncomeListResponse(data: string): { otherIncomes: OtherIncome[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { other_income, per_page, total, page, pages } = response.response.result

	return {
		otherIncomes: other_income.map((otherIncome: any) => transformOtherIncomeParsedResponse(otherIncome)),
		pages: {
			total,
			size: per_page,
			pages,
			page,
		},
	}
}

function transformOtherIncomeParsedResponse(otherIncome: any): OtherIncome {
	return {
		incomeId: otherIncome.incomeid,
		amount: otherIncome.amount && transformMoneyParsedResponse(otherIncome.amount),
		categoryName: otherIncome.category_name,
		createdAt: otherIncome.created_at && transformDateResponse(otherIncome.created_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
		date: otherIncome.date && transformDateResponse(otherIncome.date, DateFormat['YYYY-MM-DD']),
		note: otherIncome.note,
		paymentType: otherIncome.payment_type,
		source: otherIncome.source,
		taxes: otherIncome.taxes && otherIncome.taxes.map((tax: any): Tax => transformTaxParsedResponse(tax)),
		updatedAt: otherIncome.updated_at && transformDateResponse(otherIncome.updated_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
		visState: otherIncome.vis_state,
	}
}

export function transformOtherIncomeRequest(otherIncome: OtherIncome): string {
	const request = JSON.stringify({
		other_income: {
			amount: otherIncome.amount,
			category_name: otherIncome.categoryName,
			date: otherIncome.date && transformDateRequest(otherIncome.date),
			note: otherIncome.note,
			payment_type: otherIncome.paymentType,
			source: otherIncome.source,
			taxes: otherIncome.taxes && otherIncome.taxes.map((tax) => transformTaxRequest(tax)),
		},
	})
	return request
}
