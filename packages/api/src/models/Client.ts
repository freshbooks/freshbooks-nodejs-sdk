/* eslint-disable @typescript-eslint/camelcase */
import { ErrorResponse, isErrorResponse, transformErrorResponse } from './Error'
import Pagination from './Pagination'
import { Nullable } from './helpers'

export default interface Client {
	id?: string
	fName?: Nullable<string>
	lName?: Nullable<string>
	organization?: Nullable<string>
	email?: Nullable<string>
	allowLateNotifications?: boolean
	sCode?: string
	fax?: string
	lastActivity?: Nullable<Date>
	numLogins?: number
	vatNumber?: Nullable<string>
	prefEmail?: boolean
	directLinkToken?: Nullable<string>
	sProvince?: string
	vatName?: Nullable<string>
	sCity?: string
	sStreet2?: string
	statementToken?: Nullable<string>
	note?: Nullable<string>
	mobPhone?: string
	lastLogin?: Nullable<string>
	homePhone?: Nullable<string>
	companyIndustry?: Nullable<string>
	subdomain?: Nullable<string>
	username?: Nullable<string>
	updated?: Nullable<Date>
	pProvince?: string
	pCity?: string
	busPhone?: string
	allowLateFees?: boolean
	pStreet?: string
	companySize?: Nullable<string>
	accountingSystemId?: Nullable<string>
	pCode?: string
	signupDate?: Nullable<Date>
	language?: Nullable<string>
	level?: number
	notified?: boolean
	userId?: Nullable<string>
	pStreet2?: string
	prefGmail?: boolean
	visState?: number
	sCountry?: string
	sStreet?: string
	pCountry?: string
	currencyCode?: string
	hasRetainer?: Nullable<string>
	retainerId?: Nullable<string>
	role?: Nullable<string>
}

function transformClientData(client: any): Client {
	return {
		id: client.id,
		allowLateNotifications: client.allow_late_notifications,
		sCode: client.s_code,
		fax: client.fax,
		lastActivity: client.last_activity,
		numLogins: client.num_logins,
		vatNumber: client.vat_number,
		prefEmail: client.pref_email,
		directLinkToken: client.direct_link_token,
		sProvince: client.s_province,
		vatName: client.vat_name,
		fName: client.fname,
		lName: client.lname,
		sCity: client.s_city,
		sStreet2: client.s_street2,
		statementToken: client.statement_token,
		note: client.note,
		mobPhone: client.mob_phone,
		lastLogin: client.last_login,
		homePhone: client.home_phone,
		companyIndustry: client.company_industry,
		subdomain: client.subdomain,
		email: client.email,
		username: client.username,
		updated: client.updated,
		pProvince: client.p_province,
		pCity: client.p_city,
		busPhone: client.bus_phone,
		allowLateFees: client.allow_late_fees,
		pStreet: client.p_street,
		companySize: client.company_size,
		accountingSystemId: client.accounting_systemid,
		pCode: client.p_code,
		signupDate: client.signup_date,
		language: client.language,
		level: client.level,
		notified: client.notified,
		userId: client.userid,
		pStreet2: client.p_street2,
		prefGmail: client.pref_gmail,
		visState: client.vis_state,
		sCountry: client.s_country,
		sStreet: client.s_street,
		organization: client.organization,
		pCountry: client.p_country,
		currencyCode: client.currency_code,
		hasRetainer: client.has_retainer,
		retainerId: client.retainer_id,
		role: client.role,
	}
}

/**
 * Parses JSON client response and converts to @Client model
 * @param data representing JSON response
 * @returns @Client | @Error
 */
export function transformClientResponse(data: any): Client | ErrorResponse {
	const response = JSON.parse(data)

	if (isErrorResponse(response)) {
		return transformErrorResponse(response)
	}
	const {
		response: { result },
	} = response
	const { client } = result
	return transformClientData(client)
}

/**
 * Parses JSON list response and converts to internal client list response
 * @param data representing JSON response
 * @returns client list response
 */
export function transformClientListResponse(
	data: string
): { clients: Client[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isErrorResponse(response)) {
		return transformErrorResponse(response)
	}
	const {
		response: { result },
	} = response
	const { clients, per_page, total, page, pages } = result
	return {
		pages: {
			page,
			pages,
			size: per_page,
			total,
		},
		clients: clients.map((client: Client) => transformClientData(client)),
	}
}

/**
 * Converts @Client object into JSON string
 * @param client @Client object
 * @returns JSON string representing client request
 */
export function transformClientRequest(client: Client): string {
	const model = {
		client: {
			id: client.id,
			allow_late_notifications: client.allowLateNotifications,
			s_code: client.sCode,
			fax: client.fax,
			last_activity: client.lastActivity,
			num_logins: client.numLogins,
			vat_number: client.vatNumber,
			pref_email: client.prefEmail,
			direct_link_token: client.directLinkToken,
			s_province: client.sProvince,
			vat_name: client.vatName,
			fname: client.fName,
			lname: client.lName,
			s_city: client.sCity,
			s_street2: client.sStreet2,
			statement_token: client.statementToken,
			note: client.note,
			mob_phone: client.mobPhone,
			last_login: client.lastLogin,
			home_phone: client.homePhone,
			company_industry: client.companyIndustry,
			subdomain: client.subdomain,
			email: client.email,
			username: client.username,
			updated: client.updated,
			p_province: client.pProvince,
			p_city: client.pCity,
			bus_phone: client.busPhone,
			allow_late_fees: client.allowLateFees,
			p_street: client.pStreet,
			company_size: client.companySize,
			accounting_systemid: client.accountingSystemId,
			p_code: client.pCode,
			signup_date: client.signupDate,
			language: client.language,
			level: client.level,
			notified: client.notified,
			user_id: client.userId,
			p_street2: client.pStreet2,
			pref_gmail: client.prefGmail,
			vis_state: client.visState,
			s_country: client.sCountry,
			s_street: client.sStreet,
			organization: client.organization,
			p_country: client.pCountry,
			currency_code: client.currencyCode,
			has_retainer: client.hasRetainer,
			retainer_id: client.retainerId,
			role: client.role,
		},
	}
	return JSON.stringify(model)
}
