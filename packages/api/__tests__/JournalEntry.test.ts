/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import APIClient, { Options } from '../src/APIClient'
import JournalEntry from '../src/models/JournalEntry'

const mock = new MockAdapter(axios)

const ACCOUNT_ID = 'AbCxYz'
const APPLICATION_CLIENT_ID = 'test-client-id'
const testOptions: Options = { accessToken: 'token' }

const CURRENCY_CODE = 'CAD'
const DESCRIPTION = 'This is a test journal entry.'
const ID = 1234567
const NAME = 'TestJournalEntry'

const CREDIT = '200'
const DEBIT = '200'
const ID_DETAIL = 9876543
const ID_SUB = 123987
const USER_DATE = '2022-10-28'

const buildMockRequest = (journalEntryProperties: any = {}): any => ({
	journal_entry: {
		currency_code: CURRENCY_CODE,
		description: DESCRIPTION,
		details: [
			{
				debit: DEBIT,
				sub_accountid: ID_SUB,
			},
			{
				credit: CREDIT,
				sub_accountid: ID_SUB,
			},
		],
		name: NAME,
		user_entered_date: USER_DATE,
		...journalEntryProperties,
	},
})

const buildMockResponse = (journalEntryProperties: any = {}): string =>
	JSON.stringify({
		currency_code: CURRENCY_CODE,
		description: DESCRIPTION,
		details: [
			{
				categoryid: null,
				credit: null,
				currency_code: CURRENCY_CODE,
				debit: DEBIT,
				description: DESCRIPTION,
				detailid: ID_DETAIL,
				id: ID_DETAIL,
				name: NAME,
				sub_accountid: ID_SUB,
				user_entered_date: USER_DATE,
			},
			{
				categoryid: null,
				credit: CREDIT,
				currency_code: CURRENCY_CODE,
				debit: null,
				description: DESCRIPTION,
				detailid: ID_DETAIL,
				id: ID_DETAIL,
				name: NAME,
				sub_accountid: ID_SUB,
				user_entered_date: USER_DATE,
			},
		],
		entryid: ID,
		id: ID,
		name: NAME,
		user_entered_date: USER_DATE,
		...journalEntryProperties,
	})

const buildModelRequest = (journalEntryProperties: any = {}): any => ({
	currencyCode: CURRENCY_CODE,
	description: DESCRIPTION,
	details: [
		{
			debit: DEBIT,
			subAccountId: ID_SUB,
		},
		{
			credit: CREDIT,
			subAccountId: ID_SUB,
		},
	],
	name: NAME,
	userEnteredDate: new Date(USER_DATE.concat(' 00:00:00')),
	...journalEntryProperties,
})

const buildModelResponse = (journalEntryProperties: any = {}): JournalEntry => ({
	currencyCode: CURRENCY_CODE,
	description: DESCRIPTION,
	details: [
		{
			categoryId: null,
			credit: null,
			currencyCode: CURRENCY_CODE,
			debit: Number(DEBIT),
			description: DESCRIPTION,
			detailId: ID_DETAIL,
			id: ID_DETAIL,
			name: NAME,
			subAccountId: ID_SUB,
			userEnteredDate: new Date(USER_DATE.concat(' 00:00:00')),
		},
		{
			categoryId: null,
			credit: Number(CREDIT),
			currencyCode: CURRENCY_CODE,
			debit: null,
			description: DESCRIPTION,
			detailId: ID_DETAIL,
			id: ID_DETAIL,
			name: NAME,
			subAccountId: ID_SUB,
			userEnteredDate: new Date(USER_DATE.concat(' 00:00:00')),
		},
	],
	entryId: ID,
	id: ID,
	name: NAME,
	userEnteredDate: new Date(USER_DATE.concat(' 00:00:00')),
	...journalEntryProperties,
})

describe('@freshbooks/api', () => {
	describe('JournalEntry', () => {
		test('POST /accounting/account/<accountid>/journal_entries/journal_entries', async () => {
			const client = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const mockRequest = buildMockRequest()
			const mockResponse = `{
					"response":{
                        "result": {
							"journal_entry": ${buildMockResponse()}
                        }
					}
				 }`

			mock
				.onPost(`/accounting/account/${ACCOUNT_ID}/journal_entries/journal_entries`, mockRequest)
				.replyOnce(200, mockResponse)

			const modelRequest = buildModelRequest()
			const modelResponse = buildModelResponse()

			const { data } = await client.journalEntries.create(modelRequest, ACCOUNT_ID)
			expect(data).toEqual(modelResponse)
		})
	})
})
