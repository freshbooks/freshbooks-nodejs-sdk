/* eslint-disable @typescript-eslint/camelcase */
import { DateFormat, transformDateResponse } from './Date'

export default interface Detail {
    categoryId?: number
    credit?: number
    currencyCode?: string
    debit?: number
    description?: string
    detailId?: number
    id?: number
    name?: string
    subAccountId: number
    userEnteredDate?: Date
}

export function transformDetailResponse(detail: any): Detail {
    return {
        categoryId: detail.categoryid,
        credit: detail.credit ? Number(detail.credit) : detail.credit,
        currencyCode: detail.currency_code,
        debit: detail.debit ? Number(detail.debit) : detail.debit,
        description: detail.description,
        detailId: detail.detailid,
        id: detail.id,
        name: detail.name,
        subAccountId: detail.sub_accountid,
        userEnteredDate: detail.user_entered_date && transformDateResponse(detail.user_entered_date, DateFormat['YYYY-MM-DD'])
    }

}

export function transformDetailRequest(detail: Detail): any {
    return {
        credit: detail.credit,
        debit: detail.debit,
        sub_accountid: detail.subAccountId,
    }
}
