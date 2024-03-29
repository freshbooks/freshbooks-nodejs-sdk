/* eslint-disable @typescript-eslint/camelcase */
import Pagination from './Pagination'
import { transformAccountingErrorResponse, isAccountingErrorResponse, ErrorResponse } from './Error'
import Money, { transformMoneyParsedResponse } from './Money'
import Tax, { transformTaxParsedRequest, transformTaxParsedResponse } from './Tax'
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

function transformOtherIncomeParsedResponse(income: any): OtherIncome {
	return {
		incomeId: income.incomeid,
		amount: income.amount && transformMoneyParsedResponse(income.amount),
		categoryName: income.category_name,
		createdAt: income.created_at && transformDateResponse(income.created_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
		date: income.date && transformDateResponse(income.date, DateFormat['YYYY-MM-DD']),
		note: income.note,
		paymentType: income.payment_type,
		source: income.source,
		taxes: income.taxes && income.taxes.map((tax: any): Tax => transformTaxParsedResponse(tax)),
		updatedAt: income.updated_at && transformDateResponse(income.updated_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
		visState: income.vis_state,
	}
}

export function transformOtherIncomeResponse(
	data: string,
	headers: Array<string>,
	status: string
): OtherIncome | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(status, response)) {
		return transformAccountingErrorResponse(response)
	}

	const { other_income } = response.response.result

	return transformOtherIncomeParsedResponse(other_income)
}

export function transformOtherIncomeListResponse(
	data: string,
	headers: Array<string>,
	status: string
): { otherIncomes: OtherIncome[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(status, response)) {
		return transformAccountingErrorResponse(response)
	}

	const { other_income, per_page, total, page, pages } = response.response.result

	return {
		otherIncomes: other_income.map((income: any): OtherIncome => transformOtherIncomeParsedResponse(income)),
		pages: {
			total,
			size: per_page,
			pages,
			page,
		},
	}
}

export function transformOtherIncomeRequest(income: OtherIncome): string {
	return JSON.stringify({
		other_income: {
			amount: income.amount,
			category_name: income.categoryName,
			date: income.date && transformDateRequest(income.date),
			note: income.note,
			payment_type: income.paymentType,
			source: income.source,
			taxes: income.taxes && income.taxes.map((tax: Tax): any => transformTaxParsedRequest(tax)),
		},
	})
}
