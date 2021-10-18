/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Client, { Options } from '../src/APIClient'
import { ShareLink } from '../src/models'

const mock = new MockAdapter(axios) // set mock adapter on default axios instance
const ACCOUNT_ID = 'xZNQ1X'
const APPLICATION_CLIENT_ID = 'test-client-id'
const testOptions: Options = {}

const buildMockResponse = (resourceId: string, resourceType: string): string => {
	return JSON.stringify({
		'clientid': 218192,
        'resource_type': resourceType,
        'resourceid': Number(resourceId),
        'share_link': 'https://my.freshbooks.com/#/link/some_super_secret_share_link?type=secondary&share_method=share_link',
    	'share_method': 'share_link'
	})
}

const buildInvoiceShareLink = (): ShareLink => ({
	clientId: 218192,
	resourceId: 217506,
	resourceType: 'invoice',
	shareLink: 'https://my.freshbooks.com/#/link/some_super_secret_share_link?type=secondary&share_method=share_link',
	shareMethod: 'share_link'
})


describe('@freshbooks/api', () => {
	describe('Invoice Share Links', () => {
		test('GET /accounting/account/<accountId>/invoices/invoices/<invoiceId>/share_link', async () => {
			const token = 'token'
			const client = new Client(APPLICATION_CLIENT_ID, token, testOptions)
			const INVOICE_ID = '217506'

			const mockResponse = `
            {"response":
                {
                    "result": {
                        "share_link": ${buildMockResponse(INVOICE_ID, 'invoice')}
                    }
                }
            }`
			mock.onGet(`/accounting/account/${ACCOUNT_ID}/invoices/invoices/${INVOICE_ID}/share_link?share_method=share_link`).replyOnce(200, mockResponse)

			const expected = buildInvoiceShareLink()
			const { data } = await client.invoices.shareLink(ACCOUNT_ID, INVOICE_ID)

			expect(data).toEqual(expected)
		})
	})
})
