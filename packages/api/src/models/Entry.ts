/* eslint-disable @typescript-eslint/camelcase */
export default interface Entry {
    accountingSystemId: string
    categoryId: number
    clientId: number
    creditId: number
    entryId: number
    expenseId: number
    id: number
    incomeId: number
    invoiceId: number
    paymentId: number
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
