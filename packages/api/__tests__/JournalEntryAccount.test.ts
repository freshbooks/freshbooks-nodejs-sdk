/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import APIClient, { Options } from '../src/APIClient'
import JournalEntryAccount from '../src/models/JournalEntryAccount'

const mock = new MockAdapter(axios)

const ACCOUNT_ID = 'AbCxYz'
const APPLICATION_CLIENT_ID = 'test-client-id'
const testOptions: Options = { accessToken: 'token' }

const ACCOUNT_NAME = 'Operating Expenses'
const ACCOUNT_NUMBER = '6000'
const ACCOUNT_TYPE = 'expense'
const CURRENCY_CODE = 'CAD'
const ID = 1234567

const ACCOUNT_SUB_NAME = 'Advertising'
const ACCOUNT_SUB_NUMBER = '1'
const ID_SUB = 9876543

const buildMockResponse = (journalEntryAccountProperties: any = {}): string =>
	JSON.stringify({
		account_name: ACCOUNT_NAME,
		account_number: ACCOUNT_NUMBER,
		account_type: ACCOUNT_TYPE,
		accountid: ID,
		balance: '0',
		created_at: '2022-08-16 14:11:07',
		currency_code: CURRENCY_CODE,
		id: ID,
		sub_accounts: [
			{
				account_sub_name: ACCOUNT_SUB_NAME,
				account_sub_number: ACCOUNT_SUB_NUMBER,
				account_type: ACCOUNT_TYPE,
				balance: '0',
				created_at: '2022-08-16 14:11:07',
				currency_code: CURRENCY_CODE,
				custom: true,
				id: ID_SUB,
				parentid: ID,
				sub_accountid: ID_SUB,
				transaction_posted: false,
			},
		],
		...journalEntryAccountProperties,
	})

const buildModelResponse = (journalEntryAccountProperties: any = {}): JournalEntryAccount => ({
	accountName: ACCOUNT_NAME,
	accountNumber: ACCOUNT_NUMBER,
	accountType: ACCOUNT_TYPE,
	accountId: ID,
	balance: 0,
	createdAt: new Date('2022-08-16T18:11:07Z'),
	currencyCode: CURRENCY_CODE,
	id: ID,
	subAccounts: [
		{
			accountSubName: ACCOUNT_SUB_NAME,
			accountSubNumber: ACCOUNT_SUB_NUMBER,
			accountType: ACCOUNT_TYPE,
			balance: 0,
			createdAt: new Date('2022-08-16T18:11:07Z'),
			currencyCode: CURRENCY_CODE,
			custom: true,
			id: ID_SUB,
			parentId: ID,
			subAccountId: ID_SUB,
			transactionPosted: false,
		},
	],
	...journalEntryAccountProperties,
})

describe('@freshbooks/api', () => {
	describe('JournalEntryAccount', () => {
		test('GET /accounting/account/<accountid>/journal_entry_accounts/journal_entry_accounts', async () => {
			const client = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const mockResponse = `{
					"response":{
                        "result": {
							"journal_entry_accounts": [${buildMockResponse()}],
							"page": 1,
							"pages": 1,
							"per_page": 17,
							"total": 17
                        }
					}
				 }`

			mock
				.onGet(`/accounting/account/${ACCOUNT_ID}/journal_entry_accounts/journal_entry_accounts`)
				.replyOnce(200, mockResponse)

			const { data } = await client.journalEntryAccounts.list(ACCOUNT_ID)

			const modelResponse = {
				journalEntryAccounts: [buildModelResponse()],
				pages: {
					page: 1,
					pages: 1,
					size: 17,
					total: 17,
				},
			}

			expect(data).toEqual(modelResponse)
		})
	})
})
