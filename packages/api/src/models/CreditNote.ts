import Pagination from './Pagination'
import { transformErrorResponse, isAccountingErrorResponse, ErrorResponse } from './Error'
import Money, { transformMoneyRequest, transformMoneyResponse } from './Money'
import { Nullable } from './helpers'
import VisState from './VisState'
import Line, { transformLineRequest, transformLineResponse } from './Line'
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

function transformCreditNoteData(creditNote: any): CreditNote {
    return {
        id: creditNote.id,
        creditId: creditNote.creditid,
        accountingSystemId: creditNote.accounting_systemid,
        clientId: creditNote.clientid,
        code: creditNote.code,
        sentId: creditNote.sentid,
        amount: creditNote.amount && transformMoneyResponse(creditNote.amount),
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
        lines: creditNote.lines && creditNote.lines.map(transformLineResponse),
        lName: creditNote.lname,
        notes: creditNote.notes,
        organization: creditNote.organization,
        paid: creditNote.paid && transformMoneyResponse(creditNote.paid),
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

export function transformCreditNoteResponse(data: string): CreditNote | ErrorResponse {
    const response = JSON.parse(data)

    if (isAccountingErrorResponse(response)) {
        return transformErrorResponse(response)
    }

    const { credit_notes } = response.response.result

    return transformCreditNoteData(credit_notes)
}

export function transformCreditNoteListResponse(data: string): { creditNotes: CreditNote[]; pages: Pagination } | ErrorResponse {
    const response = JSON.parse(data)

    if (isAccountingErrorResponse(response)) {
        return transformErrorResponse(response)
    }

    const { credit_notes, per_page, total, page, pages } = response.response.result

    return {
        creditNotes: credit_notes.map(transformCreditNoteData),
        pages: {
            total,
            size: per_page,
            pages,
            page,
        }
    }
}

export function transformCreditNoteRequest(credit_note: CreditNote): string {
    const request = JSON.stringify({
        credit_notes: {
            accounting_systemid: credit_note.accountingSystemId,
            amount: credit_note.amount && transformMoneyRequest(credit_note.amount),
            city: credit_note.city,
            clientid: credit_note.clientId,
            country: credit_note.country,
            code: credit_note.code,
            create_date: credit_note.createDate && transformDateRequest(credit_note.createDate),
            credit_number: credit_note.creditNumber,
            credit_type: credit_note.creditType,
            creditid: credit_note.creditId,
            current_organization: credit_note.currentOrganization,
            currency_code: credit_note.currencyCode,
            description: credit_note.description,
            display_status: credit_note.displayStatus,
            dispute_status: credit_note.disputeStatus,
            ext_archive: credit_note.extArchive,
            fname: credit_note.fName,
            id: credit_note.id,
            language: credit_note.language,
            last_order_status: credit_note.lastOrderStatus,
            lname: credit_note.lName,
            lines: credit_note.lines && credit_note.lines.map(transformLineRequest),
            notes: credit_note.notes,
            organization: credit_note.organization,
            paid: credit_note.paid && transformMoneyRequest(credit_note.paid),
            payment_status: credit_note.paymentStatus,
            payment_type: credit_note.paymentType,
            province: credit_note.province,
            sentid: credit_note.sentId,
            status: credit_note.status,
            street: credit_note.street,
            street2: credit_note.street2,
            template: credit_note.template,
            terms: credit_note.terms,
            vat_name: credit_note.vatName,
            vat_number: credit_note.vatNumber,
            vis_state: credit_note.visState,
        },
    })
    return request
}