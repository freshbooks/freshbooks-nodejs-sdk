/* eslint-disable @typescript-eslint/camelcase */
import { transformBillVendorTaxJSON, transformBillVendorTaxResponse } from '../src/models/BillVendorTax'

describe('@freshbooks/api', () => {
	describe('BillVendorTax', () => {
		test('Verify JSON -> model transform', async () => {
			const json = `{
                "vendorid": 1563,
				"tax_id":515,
				"system_taxid":1752,
				"enabled": true,
				"name":"GST",
				"amount": "5",
				"tax_authorityid": "l1v3l7",
				"updated_at": "2019-06-05 11:42:54",
				"created_at": "2019-06-05 11:42:54"

            }`
			const model = transformBillVendorTaxJSON(json)

			const expected = {
				vendorId: 1563,
				taxId: 515,
				systemTaxid: 1752,
				enabled: true,
				name: 'GST',
				amount: '5',
				taxAuthorityid: 'l1v3l7',
				updatedAt: new Date('2019-06-05T15:42:54.000Z'),
				createdAt: new Date('2019-06-05T15:42:54.000Z'),
			}

			expect(model).toEqual(expected)
		})
		test('Verify parsed JSON -> model transform', async () => {
			const data = {
				vendorid: 1563,
				tax_id: 515,
				system_taxid: 1752,
				enabled: true,
				name: 'GST',
				amount: '5',
				tax_authorityid: 'l1v3l7',
				updated_at: '2019-06-05 11:42:54',
				created_at: '2019-06-05 11:42:54',
			}
			const model = transformBillVendorTaxResponse(data)

			expect(model).toEqual(
				expect.objectContaining({
					vendorId: 1563,
					taxId: 515,
					systemTaxid: 1752,
					enabled: true,
					name: 'GST',
					amount: '5',
					taxAuthorityid: 'l1v3l7',
					updatedAt: new Date('2019-06-05T15:42:54.000Z'),
					createdAt: new Date('2019-06-05T15:42:54.000Z'),
				})
			)
		})
	})
})
