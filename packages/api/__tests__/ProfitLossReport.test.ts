/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Client, { Options } from '../src/APIClient'
import { transformProfitLossReportData } from '../src/models/ProfitLossReport'

const mock = new MockAdapter(axios)
const ACCOUNT_ID = 'xZNQ1X'
const APPLICATION_CLIENT_ID = 'test-client-id'
const testOptions: Options = { accessToken: 'token' }
const PROFIT_LOSS_RESPONSE = JSON.stringify({
	cash_based: false,
	company_name: 'My Company',
	currency_code: 'CAD',
	dates: [
		{
			end_date: '2021-09-30',
			start_date: '2021-09-01',
		},
		{
			end_date: '2021-10-31',
			start_date: '2021-10-01',
		},
	],
	download_token: 'long.downloadtoken',
	end_date: '2021-10-30',
	expenses: [
		{
			children: [
				{
					children: [
						{
							children: [],
							data: [
								{
									amount: '0.00',
									code: 'CAD',
								},
								{
									amount: '100.00',
									code: 'CAD',
								},
							],
							description: 'Bills',
							entry_type: 'debit',
							total: {
								amount: '100.00',
								code: 'CAD',
							},
						},
					],
					data: [
						{
							amount: '0.00',
							code: 'CAD',
						},
						{
							amount: '100.00',
							code: 'CAD',
						},
					],
					description: 'Office Expenses & Postage (general)',
					entry_type: 'debit',
					total: {
						amount: '100.00',
						code: 'CAD',
					},
				},
			],
			data: [
				{
					amount: '0.00',
					code: 'CAD',
				},
				{
					amount: '100.00',
					code: 'CAD',
				},
			],
			description: 'Office Expenses & Postage',
			entry_type: 'debit',
			total: {
				amount: '100.00',
				code: 'CAD',
			},
		},
		{
			children: [
				{
					children: [
						{
							children: [],
							data: [
								{
									amount: '0.00',
									code: 'CAD',
								},
								{
									amount: '8.85',
									code: 'CAD',
								},
							],
							description: 'Expenses',
							entry_type: 'debit',
							total: {
								amount: '8.85',
								code: 'CAD',
							},
						},
					],
					data: [
						{
							amount: '0.00',
							code: 'CAD',
						},
						{
							amount: '8.85',
							code: 'CAD',
						},
					],
					description: 'Testing',
					entry_type: 'debit',
					total: {
						amount: '8.85',
						code: 'CAD',
					},
				},
			],
			data: [
				{
					amount: '0.00',
					code: 'CAD',
				},
				{
					amount: '8.85',
					code: 'CAD',
				},
			],
			description: 'Professional Services',
			entry_type: 'debit',
			total: {
				amount: '8.85',
				code: 'CAD',
			},
		},
	],
	gross_margin: {
		children: [],
		data: [
			{
				amount: '0.00',
				code: '%',
			},
			{
				amount: '100.00',
				code: '%',
			},
		],
		description: 'Gross Margin',
		entry_type: 'none',
		total: {
			amount: '100.00',
			code: '%',
		},
	},
	net_profit: {
		children: [],
		data: [
			{
				amount: '0.00',
				code: 'CAD',
			},
			{
				amount: '1118.58',
				code: 'CAD',
			},
		],
		description: 'Net Profit (CAD)',
		entry_type: 'credit',
		total: {
			amount: '1118.58',
			code: 'CAD',
		},
	},
	income: [
		{
			children: [
				{
					children: [],
					data: [
						{
							amount: '0.00',
							code: 'CAD',
						},
						{
							amount: '-100.00',
							code: 'CAD',
						},
					],
					description: 'Credit',
					entry_type: 'credit',
					total: {
						amount: '-100.00',
						code: 'CAD',
					},
				},
				{
					children: [],
					data: [
						{
							amount: '0.00',
							code: 'CAD',
						},
						{
							amount: '1327.43',
							code: 'CAD',
						},
					],
					description: 'Other Income',
					entry_type: 'credit',
					total: {
						amount: '1327.43',
						code: 'CAD',
					},
				},
			],
			data: [
				{
					amount: '0.00',
					code: 'CAD',
				},
				{
					amount: '1227.43',
					code: 'CAD',
				},
			],
			description: 'Sales',
			entry_type: 'credit',
			total: {
				amount: '1227.43',
				code: 'CAD',
			},
		},
		{
			children: [],
			data: [
				{
					amount: '0.00',
					code: 'CAD',
				},
				{
					amount: '0.00',
					code: 'CAD',
				},
			],
			description: 'Cost of Goods Sold',
			entry_type: 'credit',
			total: {
				amount: '0.00',
				code: 'CAD',
			},
		},
	],
	labels: ['2021-09-01', '2021-10-01'],
	resolution: 'm',
	start_date: '2021-09-30',
	total_expenses: {
		children: [],
		data: [
			{
				amount: '0.00',
				code: 'CAD',
			},
			{
				amount: '108.85',
				code: 'CAD',
			},
		],
		description: 'Total Expenses',
		entry_type: 'debit',
		total: {
			amount: '108.85',
			code: 'CAD',
		},
	},
	total_income: {
		children: [],
		data: [
			{
				amount: '0.00',
				code: 'CAD',
			},
			{
				amount: '1227.43',
				code: 'CAD',
			},
		],
		description: 'Gross Profit',
		entry_type: 'credit',
		total: {
			amount: '1227.43',
			code: 'CAD',
		},
	},
})

const EXPECTED = {
	cashBased: false,
	companyName: 'My Company',
	currencyCode: 'CAD',
	downloadToken: 'long.downloadtoken',
	startDate: '2021-09-30',
	endDate: '2021-10-30',
	resolution: 'm',
	labels: ['2021-09-01', '2021-10-01'],
	grossMargin: {
		children: [],
		data: [
			{
				amount: 0.0,
				code: '%',
			},
			{
				amount: 100.0,
				code: '%',
			},
		],
		description: 'Gross Margin',
		entryType: 'none',
		total: {
			amount: 100.0,
			code: '%',
		},
	},
	netProfit: {
		children: [],
		data: [
			{
				amount: 0.0,
				code: 'CAD',
			},
			{
				amount: 1118.58,
				code: 'CAD',
			},
		],
		description: 'Net Profit (CAD)',
		entryType: 'credit',
		total: {
			amount: 1118.58,
			code: 'CAD',
		},
	},
	expenses: [
		{
			children: [
				{
					children: [
						{
							children: [],
							data: [
								{
									amount: 0.0,
									code: 'CAD',
								},
								{
									amount: 100.0,
									code: 'CAD',
								},
							],
							description: 'Bills',
							entryType: 'debit',
							total: {
								amount: 100.0,
								code: 'CAD',
							},
						},
					],
					data: [
						{
							amount: 0.0,
							code: 'CAD',
						},
						{
							amount: 100.0,
							code: 'CAD',
						},
					],
					description: 'Office Expenses & Postage (general)',
					entryType: 'debit',
					total: {
						amount: 100.0,
						code: 'CAD',
					},
				},
			],
			data: [
				{
					amount: 0.0,
					code: 'CAD',
				},
				{
					amount: 100.0,
					code: 'CAD',
				},
			],
			description: 'Office Expenses & Postage',
			entryType: 'debit',
			total: {
				amount: 100.0,
				code: 'CAD',
			},
		},
		{
			children: [
				{
					children: [
						{
							children: [],
							data: [
								{
									amount: 0.0,
									code: 'CAD',
								},
								{
									amount: 8.85,
									code: 'CAD',
								},
							],
							description: 'Expenses',
							entryType: 'debit',
							total: {
								amount: 8.85,
								code: 'CAD',
							},
						},
					],
					data: [
						{
							amount: 0.0,
							code: 'CAD',
						},
						{
							amount: 8.85,
							code: 'CAD',
						},
					],
					description: 'Testing',
					entryType: 'debit',
					total: {
						amount: 8.85,
						code: 'CAD',
					},
				},
			],
			data: [
				{
					amount: 0.0,
					code: 'CAD',
				},
				{
					amount: 8.85,
					code: 'CAD',
				},
			],
			description: 'Professional Services',
			entryType: 'debit',
			total: {
				amount: 8.85,
				code: 'CAD',
			},
		},
	],
	income: [
		{
			children: [
				{
					children: [],
					data: [
						{
							amount: 0.0,
							code: 'CAD',
						},
						{
							amount: -100.0,
							code: 'CAD',
						},
					],
					description: 'Credit',
					entryType: 'credit',
					total: {
						amount: -100.0,
						code: 'CAD',
					},
				},
				{
					children: [],
					data: [
						{
							amount: 0.0,
							code: 'CAD',
						},
						{
							amount: 1327.43,
							code: 'CAD',
						},
					],
					description: 'Other Income',
					entryType: 'credit',
					total: {
						amount: 1327.43,
						code: 'CAD',
					},
				},
			],
			data: [
				{
					amount: 0.0,
					code: 'CAD',
				},
				{
					amount: 1227.43,
					code: 'CAD',
				},
			],
			description: 'Sales',
			entryType: 'credit',
			total: {
				amount: 1227.43,
				code: 'CAD',
			},
		},
		{
			children: [],
			data: [
				{
					amount: 0.0,
					code: 'CAD',
				},
				{
					amount: 0.0,
					code: 'CAD',
				},
			],
			description: 'Cost of Goods Sold',
			entryType: 'credit',
			total: {
				amount: 0.0,
				code: 'CAD',
			},
		},
	],
	totalExpenses: {
		children: [],
		data: [
			{
				amount: 0.0,
				code: 'CAD',
			},
			{
				amount: 108.85,
				code: 'CAD',
			},
		],
		description: 'Total Expenses',
		entryType: 'debit',
		total: {
			amount: 108.85,
			code: 'CAD',
		},
	},
	totalIncome: {
		children: [],
		data: [
			{
				amount: 0.0,
				code: 'CAD',
			},
			{
				amount: 1227.43,
				code: 'CAD',
			},
		],
		description: 'Gross Profit',
		entryType: 'credit',
		total: {
			amount: 1227.43,
			code: 'CAD',
		},
	},
}
describe('@freshbooks/api', () => {
	describe('ProfitLossReport', () => {
		describe('transformProfitLossReportData', () => {
			test('Verify JSON -> model transform', () => {
				const response = JSON.parse(PROFIT_LOSS_RESPONSE)
				const model = transformProfitLossReportData(response)
				expect(model).toEqual(EXPECTED)
			})
		})
		describe('GET Call', () => {
			test('GET /accounting/account/${accountId}/reports/accounting/profitloss_entity', async () => {
				const client = new Client(APPLICATION_CLIENT_ID, testOptions)
				const mockResponse = `
				{"response":
					{
						"result": {
							"profitloss": ${PROFIT_LOSS_RESPONSE}
						}
					}
				}`
				mock
					.onGet(`/accounting/account/${ACCOUNT_ID}/reports/accounting/profitloss_entity`)
					.replyOnce(200, mockResponse)
				const { data } = await client.reports.profitLoss(ACCOUNT_ID)
				expect(data).toEqual(EXPECTED)
			})
		})
	})
})
