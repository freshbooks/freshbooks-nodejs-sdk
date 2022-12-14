/* eslint-disable @typescript-eslint/camelcase */
import Pagination from './Pagination'
import { transformErrorResponse, isAccountingErrorResponse, ErrorResponse } from './Error'
import Money, { transformMoneyParsedResponse } from './Money'
import Tax, { transformTaxResponse, transformTaxRequest } from './Tax'
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

function transformOtherIncomeData({
	incomeid: incomeId,
	amount,
	category_name: categoryName,
	created_at: createdAt,
	date,
	note,
	payment_type: paymentType,
	source,
	taxes,
	updated_at: updatedAt,
	vis_state: visState,
}: any): OtherIncome {
	return {
		incomeId,
		amount: amount && transformMoneyParsedResponse(amount),
		categoryName,
		createdAt: createdAt && transformDateResponse(createdAt, DateFormat['YYYY-MM-DD hh:mm:ss']),
		date: date && transformDateResponse(date, DateFormat['YYYY-MM-DD']),
		note,
		paymentType,
		source,
		taxes: taxes && taxes.map((tax: any): Tax => transformTaxResponse(tax)),
		updatedAt: updatedAt && transformDateResponse(updatedAt, DateFormat['YYYY-MM-DD hh:mm:ss']),
		visState,
	}
}

export function transformOtherIncomeResponse(data: string): OtherIncome | ErrorResponse {
	const response = JSON.parse(data)
	
	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { other_income } = response.response.result

	return transformOtherIncomeData(other_income)
}

export function transformListOtherIncomesResponse(
	data: string
): { otherIncomes: OtherIncome[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { other_income, per_page, total, page, pages } = response.response.result
	return {
		otherIncomes: other_income.map((otherIncome: any) => transformOtherIncomeData(otherIncome)),
		pages: {
			page,
			pages,
			size: per_page,
			total,
		},
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
