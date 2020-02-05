import Money, { transformMoneyRequest, transformMoneyResponse } from './Money'
import VisState from './VisState'
import { ErrorResponse, isErrorResponse, transformErrorResponse } from './Error'
import Pagination from './Pagination'
import { transformDateRequest, DateFormat, transformDateResponse } from './Date'
import { Nullable } from './helpers'

/* eslint-disable @typescript-eslint/camelcase */

export enum PaymentType {
	Check = 'Check',
	Credit = 'Credit',
	Cash = 'Cash',
}

export default interface Payment {
	orderId?: number
	accountingSystemId?: string
	updated?: Date
	invoiceId: string
	creditId?: Nullable<string>
	amount: Money
	clientId?: string
	visState?: VisState
	logId?: string
	note?: string
	overpaymentId?: Nullable<string>
	gateway?: Nullable<string>
	date: Date
	transactionId?: Nullable<string>
	fromCredit?: boolean
	type?: PaymentType
	id?: string
}

function transformPaymentData({
	orderid: orderId,
	accounting_systemid: accountingSystemId,
	updated,
	invoiceid: invoiceId,
	creditid: creditId,
	amount,
	clientid: clientId,
	vis_state: visState,
	logid: logId,
	note,
	overpaymentid: overpaymentId,
	gateway,
	date,
	transactionid: transactionId,
	from_credit: fromCredit,
	type,
	id,
}: any): Payment {
	return {
		orderId,
		accountingSystemId,
		updated: transformDateResponse(updated, DateFormat['YYYY-MM-DD hh:mm:ss']),
		invoiceId,
		creditId,
		amount: transformMoneyResponse(amount),
		clientId,
		visState,
		logId,
		note,
		overpaymentId,
		gateway,
		date: transformDateResponse(date, DateFormat['YYYY-MM-DD']),
		transactionId,
		fromCredit,
		type,
		id,
	}
}
/**
 * Format an Payment response object
 * @param data Payment object
 *  eg. {
 *        "accounting_systemid": "xZNQ1X",
 *        "amount": {
 *          "amount": "100.00",
 *          "code": "USD"
 *        },
 *        "clientid": 212566,
 *        "creditid": null,
 *        "date": "2019-10-22",
 *        "from_credit": false,
 *        "gateway": null,
 *        "id": 115804,
 *        "invoiceid": 197902,
 *        "logid": 115804,
 *        "note": "",
 *        "orderid": null,
 *        "overpaymentid": null,
 *        "transactionid": null,
 *        "type": "Cash",
 *        "updated": "2019-10-22 12:18:29",
 *        "vis_state": 0
 *      }
 * @returns Payment object
 */
export function transformPaymentResponse(data: any): Payment | ErrorResponse {
	const response = JSON.parse(data)

	if (isErrorResponse(response)) {
		return transformErrorResponse(response)
	}
	const {
		response: { result },
	} = response
	const { payment } = result
	return transformPaymentData(payment)
}

export function transformPaymentListResponse(
	data: string
): { payments: Payment[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const {
		response: {
			result: { payments, per_page, total, page, pages },
		},
	} = response

	return {
		payments: payments.map((payment: any) => transformPaymentData(payment)),
		pages: {
			page,
			pages,
			size: per_page,
			total,
		},
	}
}

/**
 * Parse a JSON string to @Payment object
 * @param json JSON string
 * eg: `{
 *         "email": "bhaskar@secretmission.io",
 *         "fname": "Johnny",
 *         "lname": "Appleseed",
 *         "organization": "",
 *         "userid": 1
 *      }`
 * @returns Payment object
 */
export function transformPaymentJSON(json: string): Payment | ErrorResponse {
	const response = JSON.parse(json)
	return transformPaymentResponse(response)
}

export function transformPaymentRequest({
	orderId: orderid,
	invoiceId: invoiceid,
	amount,
	visState: vis_state,
	note,
	date,
	transactionId: transactionid,
	type,
}: Payment): string {
	const result = JSON.stringify({
		payment: {
			amount: amount && transformMoneyRequest(amount),
			date: transformDateRequest(date),
			invoiceid,
			note,
			orderid,
			transactionid,
			type,
			vis_state,
		},
	})
	return result
}

export function transformPaymentUpdateRequest({
	orderId: orderid,
	amount,
	note,
	date,
	transactionId: transactionid,
	type,
}: Payment): string {
	const result = JSON.stringify({
		payment: {
			amount: amount && transformMoneyRequest(amount),
			date: date && transformDateRequest(date),
			note,
			orderid,
			transactionid,
			type,
		},
	})
	return result
}
