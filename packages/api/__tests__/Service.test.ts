/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import APIClient, { Options } from '../src/APIClient'
import { Service } from '../src/models'

const mock = new MockAdapter(axios) // set mock adapter on default axios instance

const BUSINESS_ID = 12345
const SERVICE_ID = 218192
const testOptions: Options = { clientId: 'test-client-id' }

const buildServiceResponse = (serviceResponseProperties: any = {}): any => ({
	business_id: BUSINESS_ID,
	id: SERVICE_ID,
	name: 'Document Review',
	billable: true,
	vis_state: 0,
	...serviceResponseProperties,
})

const buildMockResponse = (serviceResponseProperties: any = {}): string =>
	JSON.stringify({
		service: buildServiceResponse(serviceResponseProperties),
	})

const buildService = (serviceResponseProperties: any = {}): Service => ({
	businessId: BUSINESS_ID,
	id: SERVICE_ID,
	name: 'Document Review',
	billable: true,
	visState: 0,
	...serviceResponseProperties,
})
const buildMockRequest = (serviceResponseProperties: any = {}): any => ({
	service: {
		name: 'Document Review',
		...serviceResponseProperties,
	},
})

describe('@freshbooks/api', () => {
	describe('Service', () => {
		test('GET /comments/business/<businessId>/services', async () => {
			const token = 'token'
			const APIclient = new APIClient(token, testOptions)
			const response = `{
		    "meta": {
                "total": 1,
                "per_page": 30,
                "page": 1,
                "pages": 1
            },
		    "services": [
		        ${JSON.stringify(buildServiceResponse())}
		    ]
		    }`
			const expected = {
				services: [buildService()],
				pages: {
					page: 1,
					pages: 1,
					size: 30,
					total: 1,
				},
			}

			mock.onGet(`/comments/business/${BUSINESS_ID}/services`).replyOnce(200, response)

			const { data } = await APIclient.services.list(BUSINESS_ID)
			expect(data).toEqual(expected)
		})

		test('GET /comments/business/<businessId>/service/<serviceId>', async () => {
			const token = 'token'
			const APIclient = new APIClient(token, testOptions)

			const mockResponse = buildMockResponse()

			mock.onGet(`/comments/business/${BUSINESS_ID}/service/${SERVICE_ID}`).replyOnce(200, mockResponse)

			const expected = buildService()

			const { data } = await APIclient.services.single(BUSINESS_ID, SERVICE_ID)

			expect(data).toEqual(expected)
		})

		test('POST /comments/business/<businessId>/service', async () => {
			const token = 'token'
			const APIclient = new APIClient(token, testOptions)

			const mockRequest = buildMockRequest()
			const mockResponse = buildMockResponse()

			mock.onPost(`/comments/business/${BUSINESS_ID}/service`, mockRequest).reply(200, mockResponse)
			const service = buildService()

			const { data } = await APIclient.services.create(service, BUSINESS_ID)

			expect(data).toEqual(service)
		})
	})
})
