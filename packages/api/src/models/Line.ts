import Money from './Money'

export enum LineType {
	normal,
	billing,
}

export default interface Line {
	amount: Money
	basecampId: string
	compoundedTax: boolean
	date: Date
	description: string
	expenseId: string
	invoiceId: string
	lineId: string
	name: string
	qty: number
	taxName1: string
	taxAmount1: number
	taxName2: string
	taxAmount2: number
	type: LineType
	unitCost: Money
	updated: Date
}

/**
 * Format a Line response object
 * @param data Account business object
 * eg: { "amount": "1234.00", "code": "USD" }
 * @returns Money object
 */
// export function transformLineRequest({amount,
//     basecampId,
//     compoundedTax,
//     date,
//     description,
//     expenseId,
//     invoiceId,
//     name,
//     qty,
//     taxName1,
//     taxAmount1,
//     taxName2,
//     taxAmount2,
//     type,
//     unitCost}: Line): string {
// 	return {
//         basecampid: basecampId,
//         compounded_tax: compoundedTax,
//         description,
//         expenseId: string
//         invoiceId: string
//         lineId: string
//         name: string
//         qty: number
//         taxName1: string
//         taxAmount1: number
//         taxName2: string
//         taxAmount2: number
//         type: LineType
//         unitCost: Money
//         updated: Date
//     }
// }
