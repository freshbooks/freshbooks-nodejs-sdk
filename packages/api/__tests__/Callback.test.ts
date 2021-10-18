/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Client, { Options } from '../src/APIClient'
import { Callback } from '../src/models'

const mock = new MockAdapter(axios) // set mock adapter on default axios instance
const ACCOUNT_ID = 'xZNQ1X'
const APPLICATION_CLIENT_ID = 'test-client-id'
const testOptions: Options = {}

const buildMockResponse = (resourceId: string): string => {
	return JSON.stringify({
		'callbackid': Number(resourceId),
        'event': 'invoice.create',
        'uri': 'http://goolge.com',
        'verified': true,
    	'updated_at': '2021-10-17 05:48:42',
	})
}

const buildCallback = (): Callback => ({
	callbackId: 80001,
	event: 'invoice.create',
	uri: 'http://goolge.com',
	verified: true,
	updatedAt: new Date('2021-10-17 09:48:42Z'),
})

describe('@freshbooks/api', () => {
	describe('Callbacks', () => {
		test('GET Callback single', async () => {
			const token = 'token'
			const client = new Client(APPLICATION_CLIENT_ID, token, testOptions)
			const CALLBACK_ID = '80001'

			const mockResponse = `
            {"response":
                {
                    "result": {
                        "callback": ${buildMockResponse(CALLBACK_ID)}
                    }
                }
            }`
			mock.onGet(`/events/account/${ACCOUNT_ID}/events/callbacks/${CALLBACK_ID}`).replyOnce(200, mockResponse)

			const expected = buildCallback()
			const { data } = await client.callbacks.single(ACCOUNT_ID, CALLBACK_ID)

			expect(data).toEqual(expected)
		})

		test('PUT Callback Verification', async () => {
			const token = 'token'
			const client = new Client(APPLICATION_CLIENT_ID, token, testOptions)
			const CALLBACK_ID = '80001'
			const VERIFIER = 'some_verifier'

			const mockResponse = `
            {"response":
                {
                    "result": {
                        "callback": ${buildMockResponse(CALLBACK_ID)}
                    }
                }
            }`

			const mockRequest = {
                "callback": {
					"verifier": VERIFIER
				}
            }
			mock.onPut(`/events/account/${ACCOUNT_ID}/events/callbacks/${CALLBACK_ID}`, mockRequest).replyOnce(200, mockResponse)

			await client.callbacks.verify(ACCOUNT_ID, CALLBACK_ID, VERIFIER)
		})

		test('PUT Callback Resend Verification', async () => {
			const token = 'token'
			const client = new Client(APPLICATION_CLIENT_ID, token, testOptions)
			const CALLBACK_ID = '80001'

			const mockResponse = `
            {"response":
                {
                    "result": {
                        "callback": ${buildMockResponse(CALLBACK_ID)}
                    }
                }
            }`

			const mockRequest = {
                "callback": {
					"resend": true
				}
            }
			mock.onPut(`/events/account/${ACCOUNT_ID}/events/callbacks/${CALLBACK_ID}`, mockRequest).replyOnce(200, mockResponse)

			await client.callbacks.resendVerification(ACCOUNT_ID, CALLBACK_ID)
		})
	})
})
