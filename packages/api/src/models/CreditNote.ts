import Pagination from './Pagination'
import { transformErrorResponse, isAccountingErrorResponse, ErrorResponse } from './Error'
import Money, { transformMoneyRequest, transformMoneyParsedResponse } from './Money'
import { Nullable } from './helpers'
import VisState from './VisState'
import Line, { transformLineRequest, transformLineParsedResponse } from './Line'
import { transformDateResponse, DateFormat, transformDateRequest } from './Date'

enum CreditType {
    goodwill = 'goodwill',
    overpayment = 'overpayment',
    prepayment = 'prepayment',
}

enum DisplayStatus {
    draft = 'draft',
    created = 'created',
    sent = 'sent',
    viewed = 'viewed',
}

enum PaymentStatus {
    unpaid = 'unpaid',
    partial = 'partial',
    paid = 'paid',
}

enum LastOrderStatus {
    pending = 'pending',
    declined = 'declined',
    success = 'success',
}

enum DisputeStatus {
    disputed = 'disputed',
    resolved = 'resolved',
}

export default interface CreditNote {
    id?: number
    creditId?: number
    accountingSystemId?: string
    sentId?: number
    amount?: Money
    city?: string
    clientId?: string
    code?: string
    country?: string
    creditNumber?: string
    createDate?: Date
    creditType?: CreditType
    currencyCode?: string
    currentOrganization?: string
    description?: string
    displayStatus?: DisplayStatus
    disputeStatus?: Nullable<DisputeStatus>
    extArchive?: number
    fName?: string
    language?: string
    lastOrderStatus?: Nullable<LastOrderStatus>
    lines?: Array<Line>
    lName?: string
    notes?: string
    organization?: string
    paid?: Money
    paymentStatus?: PaymentStatus,
    paymentType?: Nullable<string>
    province?: string
    status?: DisplayStatus,
    street?: string
    street2?: string
    template?: string
    terms?: Nullable<string>
    vatName?: Nullable<string>
    vatNumber?: string
    visState?: VisState
}

export function transformCreditNoteResponse(data: string): CreditNote | ErrorResponse {
    const response = JSON.parse(data)

    if (isAccountingErrorResponse(response)) {
        return transformErrorResponse(response)
    }

    const { credit_notes } = response.response.result

    return transformCreditNoteParsedResponse(credit_notes)
}

export function transformCreditNoteListResponse(data: string): { creditNotes: CreditNote[]; pages: Pagination } | ErrorResponse {
    const response = JSON.parse(data)

    if (isAccountingErrorResponse(response)) {
        return transformErrorResponse(response)
    }

    const { credit_notes, per_page, total, page, pages } = response.response.result

    return {
        creditNotes: credit_notes.map((creditNote: any) => transformCreditNoteParsedResponse(creditNote)),
        pages: {
            total,
            size: per_page,
            pages,
            page,
        }
    }
}

function transformCreditNoteParsedResponse(creditNote: any): CreditNote {
    return {
        id: creditNote.id,
        creditId: creditNote.creditid,
        accountingSystemId: creditNote.accounting_systemid,
        clientId: creditNote.clientid,
        code: creditNote.code,
        sentId: creditNote.sentid,
        amount: creditNote.amount && transformMoneyParsedResponse(creditNote.amount),
        city: creditNote.city,
        country: creditNote.country,
        createDate: creditNote.create_date && transformDateResponse(creditNote.create_date, DateFormat['YYYY-MM-DD']),
        creditNumber: creditNote.credit_number,
        creditType: creditNote.credit_type,
        currencyCode: creditNote.currency_code,
        currentOrganization: creditNote.current_organization,
        description: creditNote.description,
        displayStatus: creditNote.display_status,
        disputeStatus: creditNote.dispute_status,
        extArchive: creditNote.ext_archive,
        fName: creditNote.fname,
        language: creditNote.language,
        lastOrderStatus: creditNote.last_order_status,
        lines: creditNote.lines && creditNote.lines.map(transformLineParsedResponse),
        lName: creditNote.lname,
        notes: creditNote.notes,
        organization: creditNote.organization,
        paid: creditNote.paid && transformMoneyParsedResponse(creditNote.paid),
        paymentStatus: creditNote.payment_status,
        paymentType: creditNote.payment_type,
        province: creditNote.province,
        status: creditNote.status,
        street: creditNote.street,
        street2: creditNote.street2,
        template: creditNote.template,
        terms: creditNote.terms,
        vatName: creditNote.vat_name,
        vatNumber: creditNote.vat_number,
        visState: creditNote.vis_state,
    }
}

export function transformCreditNoteRequest(creditNote: CreditNote): string {
    return JSON.stringify({
        credit_notes: {
            accounting_systemid: creditNote.accountingSystemId,
            amount: creditNote.amount && transformMoneyRequest(creditNote.amount),
            city: creditNote.city,
            clientid: creditNote.clientId,
            country: creditNote.country,
            code: creditNote.code,
            create_date: creditNote.createDate && transformDateRequest(creditNote.createDate),
            credit_number: creditNote.creditNumber,
            credit_type: creditNote.creditType,
            creditid: creditNote.creditId,
            current_organization: creditNote.currentOrganization,
            currency_code: creditNote.currencyCode,
            description: creditNote.description,
            display_status: creditNote.displayStatus,
            dispute_status: creditNote.disputeStatus,
            ext_archive: creditNote.extArchive,
            fname: creditNote.fName,
            id: creditNote.id,
            language: creditNote.language,
            last_order_status: creditNote.lastOrderStatus,
            lname: creditNote.lName,
            lines: creditNote.lines && creditNote.lines.map(transformLineRequest),
            notes: creditNote.notes,
            organization: creditNote.organization,
            paid: creditNote.paid && transformMoneyRequest(creditNote.paid),
            payment_status: creditNote.paymentStatus,
            payment_type: creditNote.paymentType,
            province: creditNote.province,
            sentid: creditNote.sentId,
            status: creditNote.status,
            street: creditNote.street,
            street2: creditNote.street2,
            template: creditNote.template,
            terms: creditNote.terms,
            vat_name: creditNote.vatName,
            vat_number: creditNote.vatNumber,
            vis_state: creditNote.visState,
        },
    })
}
