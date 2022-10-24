/* eslint-disable @typescript-eslint/camelcase */
import { DateFormat, transformDateResponse } from './Date'

export default interface SubAccount {
    accountSubName: string
    accountSubNumber: string
    accountType: string
    balance: number
    createdAt: Date
    currencyCode: string
    custom: boolean
    id: number
    parentId: number
    subAccountId: number
    transactionPosted: boolean
}

export function transformSubAccountResponse(account: any): SubAccount {
    return {
        accountSubName: account.account_sub_name,
        accountSubNumber: account.account_sub_number,
        accountType: account.account_type,
        balance: Number(account.balance),
        createdAt: account.created_at && transformDateResponse(account.created_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
        currencyCode: account.currency_code,
        custom: account.custom,
        id: account.id,
        parentId: account.parentid,
        subAccountId: account.sub_accountid,
        transactionPosted: account.transaction_posted,
    }
}
