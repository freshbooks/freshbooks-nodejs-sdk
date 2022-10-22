/* eslint-disable @typescript-eslint/camelcase */
import { DateFormat, transformDateResponse } from './Date'

export default interface SubAccount {
    accountSubName: string
    accountSubNumber: string
    accountingSystemId?: string
    accountType?: string
    balance?: string
    createdAt?: Date
    currencyCode?: string
    custom?: boolean
    id: number
    parentId: number
    subAccountId: number
    transactionPosted?: boolean
}

export function transformSubAccountResponse(account: any): SubAccount {
    return {
        accountSubName: account.account_sub_name,
        accountSubNumber: account.account_sub_number,
        accountingSystemId: account.accounting_systemid,
        accountType: account.account_type,
        balance: account.balance,
        createdAt: account.created_at && transformDateResponse(account.created_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
        currencyCode: account.currency_code,
        custom: account.custom,
        id: account.id,
        parentId: account.parentid,
        subAccountId: account.sub_accountid,
        transactionPosted: account.transaction_posted,
    }
}
