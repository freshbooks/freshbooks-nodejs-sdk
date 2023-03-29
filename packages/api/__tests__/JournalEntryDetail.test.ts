/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import APIClient, { Options } from '../src/APIClient'
import JournalEntryDetail from '../src/models/JournalEntryDetail'

const mock = new MockAdapter(axios)

const APPLICATION_CLIENT_ID = 'test-client-id'
const SYSTEM_ID = 'AbCxYz'
const testOptions: Options = { accessToken: 'token' }

const ACCOUNT_NAME = 'Operating Expenses'
const ACCOUNT_NUMBER = '6000'
const ACCOUNT_TYPE = 'expense'
const ACCOUNT_ID = 1234567

const AMOUNT = '47.60'
const CURRENCY_CODE = 'CAD'

const DESCRIPTION = 'Regular Glasses'
const DETAIL_TYPE = 'sales'
const DETAIL_ID = 1928370

const CLIENT_ID = 1010101
const ENTRY_ID = 5555555
const INVOICE_ID = 7777777

const NAME = 'Invoice 22-107'

const SUB_ACCOUNT_NAME = 'Advertising'
const SUB_ACCOUNT_NUMBER = '1'
const SUB_ACCOUNT_ID = 9876543
const PARENT_ID = 8686865

const buildMockResponse = (journalEntryDetailProperties: any = {}): string =>
	JSON.stringify({
		account: {
			account_name: ACCOUNT_NAME,
			account_number: ACCOUNT_NUMBER,
			account_type: ACCOUNT_TYPE,
			accountid: ACCOUNT_ID,
			accounting_systemid: SYSTEM_ID,
			id: ACCOUNT_ID,
		},
		accounting_systemid: SYSTEM_ID,
		balance: {
			amount: AMOUNT,
			code: CURRENCY_CODE,
		},
		credit: {
			amount: AMOUNT,
			code: CURRENCY_CODE,
		},
		debit: null,
		description: DESCRIPTION,
		detail_type: DETAIL_TYPE,
		detailid: DETAIL_ID,
		entry: {
			accounting_systemid: SYSTEM_ID,
			categoryid: null,
			clientid: CLIENT_ID,
			creditid: null,
			entryid: ENTRY_ID,
			expenseid: null,
			id: ENTRY_ID,
			incomeid: null,
			invoiceid: INVOICE_ID,
			paymentid: null,
		},
		id: DETAIL_ID,
		name: NAME,
		sub_account: {
				account_sub_name: SUB_ACCOUNT_NAME,
				account_sub_number: SUB_ACCOUNT_NUMBER,
				accounting_systemid: SYSTEM_ID,
				id: SUB_ACCOUNT_ID,
				parentid: PARENT_ID,
				sub_accountid: SUB_ACCOUNT_ID,
		},
		user_entered_date: '2022-08-16',
		...journalEntryDetailProperties,
	})

const buildModelResponse = (journalEntryDetailProperties: any = {}): JournalEntryDetail => ({
	account: {
		accountName: ACCOUNT_NAME,
		accountNumber: ACCOUNT_NUMBER,
		accountType: ACCOUNT_TYPE,
		accountId: ACCOUNT_ID,
		accountingSystemId: SYSTEM_ID,
		balance: undefined,
		createdAt: undefined,
		currencyCode: undefined,
		id: ACCOUNT_ID,
		subAccounts: undefined,
	},
	accountingSystemId: SYSTEM_ID,
	balance: {
		amount: AMOUNT,
		code: CURRENCY_CODE,
	},
	credit: {
		amount: AMOUNT,
		code: CURRENCY_CODE,
	},
	debit: null,
	description: DESCRIPTION,
	detailType: DETAIL_TYPE,
	detailId: DETAIL_ID,
	entry: {
		accountingSystemId: SYSTEM_ID,
		categoryId: null,
		clientId: CLIENT_ID,
		creditId: null,
		entryId: ENTRY_ID,
		expenseId: null,
		id: ENTRY_ID,
		incomeId: null,
		invoiceId: INVOICE_ID,
		paymentId: null,
	},
	id: DETAIL_ID,
	name: NAME,
	subAccount: {
			accountSubName: SUB_ACCOUNT_NAME,
			accountSubNumber: SUB_ACCOUNT_NUMBER,
			accountingSystemId: SYSTEM_ID,
			accountType: undefined,
			balance: undefined,
			createdAt: undefined,
			currencyCode: undefined,
			custom:	undefined,
			id: SUB_ACCOUNT_ID,
			parentId: PARENT_ID,
			subAccountId: SUB_ACCOUNT_ID,
			transactionPosted: undefined,
	},
	userEnteredDate: new Date('2022-08-16 00:00:00'),
	...journalEntryDetailProperties,
	})

describe('@freshbooks/api', () => {
	describe('JournalEntryDetail', () => {
		test('GET /accounting/account/<accountid>/journal_entries/journal_entry_details', async () => {
			const client = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const mockResponse = `{
					"response":{
                        "result": {
							"journal_entry_details": [${buildMockResponse()}],
							"page": 1,
							"pages": 7,
							"per_page": 15,
							"total": 93
                        }
					}
				 }`

			mock.onGet(`/accounting/account/${SYSTEM_ID}/journal_entries/journal_entry_details`).replyOnce(200, mockResponse)

			const { data } = await client.journalEntryDetails.list(SYSTEM_ID)

			const modelResponse= {
				journalEntryDetails: [buildModelResponse()],
				pages: {
					page: 1,
					pages: 7,
					size: 15,
					total: 93,
				},
			}

			expect(data).toEqual(modelResponse)
		})
	})
})
