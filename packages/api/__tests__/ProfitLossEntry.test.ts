/* eslint-disable @typescript-eslint/camelcase */
import ProfitLossEntry, {
	transformProfitLossEntryResponse,
	transformProfitLossEntryResponseList,
} from '../src/models/ProfitLossEntry'

describe('@freshbooks/api', () => {
	describe('ProfitLossEntry', () => {
		describe('transformProfitLossEntryResponse', () => {
			test('Verify JSON -> model transform for bare details', () => {
				const json = `{
					"children": [],
					"data": [],
					"description": "",
					"entry_type": "none",
					"total": {
						"amount": "-61.95",
						"code": "%"
					}
				}`
				const response = JSON.parse(json)
				const model = transformProfitLossEntryResponse(response)
				const expected = {
					children: [],
					data: [],
					description: '',
					entryType: 'none',
					total: {
						amount: -61.95,
						code: '%',
					},
				}
				expect(model).toEqual(expected)
			})
			test('Verify JSON -> model transform single child', () => {
				const json = `{
					"children": [],
					"data": [{
						"amount": "8.85",
						"code": "CAD"
					}, {
						"amount": "8.85",
						"code": "CAD"
					}],
					"description": "Expenses",
					"entry_type": "debit",
					"total": {
						"amount": "61.95",
						"code": "CAD"
					}
				}`
				const response = JSON.parse(json)
				const model = transformProfitLossEntryResponse(response)
				const expected = {
					children: [],
					data: [
						{
							amount: 8.85,
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
						amount: 61.95,
						code: 'CAD',
					},
				}
				expect(model).toEqual(expected)
			})
		})
		describe('transformProfitLossEntryResponseList', () => {
			test('Verify JSON -> model transform for empty children list', () => {
				const json = `{"children": []}`
				const response = JSON.parse(json)
				const model = transformProfitLossEntryResponseList(response)
				const expected: ProfitLossEntry[] = []
				expect(model).toEqual(expected)
			})

			test('Verify JSON -> model transform for single child', () => {
				const json = `[{
					"children": [],
					"data": [
					{
						"amount": "8.85",
						"code": "CAD"
					}
					],
					"description": "Expenses",
					"entry_type": "debit",
					"total": {
					"amount": "61.95",
					"code": "CAD"
					}
			  	}]`
				const response = JSON.parse(json)
				const model = transformProfitLossEntryResponseList(response)
				const expected = [
					{
						children: [],
						data: [
							{
								amount: 8.85,
								code: 'CAD',
							},
						],
						description: 'Expenses',
						entryType: 'debit',
						total: {
							amount: 61.95,
							code: 'CAD',
						},
					},
				]
				expect(model).toEqual(expected)
			})
			test('Verify JSON -> model transform for multiple children', () => {
				const json = `[{
				"children": [],
				"data": [
				  {
					"amount": "8.85",
					"code": "CAD"
				  }
				],
				"description": "Expenses",
				"entry_type": "debit",
				"total": {
				  "amount": "61.95",
				  "code": "CAD"
				}
			  }, {
				"children": [],
				"data": [
				  {
					"amount": "8.85",
					"code": "CAD"
				  }
				],
				"description": "Personal",
				"entry_type": "credit",
				"total": {
				  "amount": "61.95",
				  "code": "CAD"
				}
			  }]`
				const response = JSON.parse(json)
				const model = transformProfitLossEntryResponseList(response)
				const expected = [
					{
						children: [],
						data: [
							{
								amount: 8.85,
								code: 'CAD',
							},
						],
						description: 'Expenses',
						entryType: 'debit',
						total: {
							amount: 61.95,
							code: 'CAD',
						},
					},
					{
						children: [],
						data: [
							{
								amount: 8.85,
								code: 'CAD',
							},
						],
						description: 'Personal',
						entryType: 'credit',
						total: {
							amount: 61.95,
							code: 'CAD',
						},
					},
				]
				expect(model).toEqual(expected)
			})

			test('Verify JSON -> model transform for nested children', () => {
				const json = `[{
				"children": [{
					"children": [],
					"data": [{
						"amount": "8.85",
						"code": "CAD"
					}],
					"description": "Expenses",
					"entry_type": "debit",
					"total": {
						"amount": "61.95",
						"code": "CAD"
					}
				}],
				"data": [{
					"amount": "8.85",
					"code": "CAD"
				}],
				"description": "Expenses",
				"entry_type": "debit",
				"total": {
					"amount": "61.95",
					"code": "CAD"
				}
			
			}]`
				const response = JSON.parse(json)
				const model = transformProfitLossEntryResponseList(response)
				const expected = [
					{
						children: [
							{
								children: [],
								data: [
									{
										amount: 8.85,
										code: 'CAD',
									},
								],
								description: 'Expenses',
								entryType: 'debit',
								total: {
									amount: 61.95,
									code: 'CAD',
								},
							},
						],
						data: [
							{
								amount: 8.85,
								code: 'CAD',
							},
						],
						description: 'Expenses',
						entryType: 'debit',
						total: {
							amount: 61.95,
							code: 'CAD',
						},
					},
				]
				expect(model).toEqual(expected)
			})
		})
	})
})
