/* eslint-disable @typescript-eslint/camelcase */
import { Nullable } from './helpers'

export default interface Entry {
    accountingSystemId: string
    categoryId: Nullable<number>
    clientId: Nullable<number>
    creditId: Nullable<number>
    entryId: number
    expenseId: Nullable<number>
    id: number
    incomeId: Nullable<number>
    invoiceId: Nullable<number>
    paymentId: Nullable<number>
}

export function transformEntryResponse(entry: any): Entry {
    return {
        accountingSystemId: entry.accounting_systemid,
        categoryId: entry.categoryid,
        clientId: entry.clientid,
        creditId: entry.creditid,
        entryId: entry.entryid,
        expenseId: entry.expenseid,
        id: entry.id,
        incomeId: entry.incomeid,
        invoiceId: entry.invoiceid,
        paymentId: entry.paymentid,
    }
}
