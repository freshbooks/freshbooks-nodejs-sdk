/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import APIClient, { Options } from '../src/APIClient'
import { ServiceRate } from '../src/models'

const mock = new MockAdapter(axios) // set mock adapter on default axios instance

const BUSINESS_ID = 12345
const SERVICE_ID = 218192
const APPLICATION_CLIENT_ID = 'test-client-id'
const testOptions: Options = { accessToken: 'token' }

const buildServiceRateResponse = (serviceRateResponseProperties: any = {}): any => ({
	business_id: BUSINESS_ID,
	service_id: SERVICE_ID,
	rate: '10.0',
	...serviceRateResponseProperties,
})

const buildMockResponse = (serviceRateResponseProperties: any = {}): string =>
	JSON.stringify({
		service_rate: buildServiceRateResponse(serviceRateResponseProperties),
	})

const buildServiceRate = (serviceRateResponseProperties: any = {}): ServiceRate => ({
	businessId: BUSINESS_ID,
	serviceId: SERVICE_ID,
	rate: '10.0',
	...serviceRateResponseProperties,
})
const buildMockRequest = (serviceRateResponseProperties: any = {}): any => ({
	service_rate: {
		rate: '10.0',
		...serviceRateResponseProperties,
	},
})

describe('@freshbooks/api', () => {
	describe('ServiceRate', () => {
		test('GET /comments/business/<businessId>/service/<serviceId>/rate', async () => {
			const APIclient = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const mockResponse = buildMockResponse()

			mock.onGet(`/comments/business/${BUSINESS_ID}/service/${SERVICE_ID}/rate`).replyOnce(200, mockResponse)

			const expected = buildServiceRate()

			const { data } = await APIclient.services.rate.single(BUSINESS_ID, SERVICE_ID)

			expect(data).toEqual(expected)
		})

		test('POST /comments/business/<businessId>/service/<serviceId>/rate', async () => {
			const APIclient = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const mockRequest = buildMockRequest()
			const mockResponse = buildMockResponse()

			mock.onPost(`/comments/business/${BUSINESS_ID}/service/${SERVICE_ID}/rate`, mockRequest).reply(200, mockResponse)
			const service = buildServiceRate()

			const { data } = await APIclient.services.rate.create(service, BUSINESS_ID, SERVICE_ID)

			expect(data).toEqual(service)
		})

		test('PUT /comments/business/<businessId>/service/<serviceId>/rate', async () => {
			const APIclient = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const mockRequest = buildMockRequest()
			const mockResponse = buildMockResponse()

			mock.onPut(`/comments/business/${BUSINESS_ID}/service/${SERVICE_ID}/rate`, mockRequest).reply(200, mockResponse)
			const service = buildServiceRate()

			const { data } = await APIclient.services.rate.update(service, BUSINESS_ID, SERVICE_ID)

			expect(data).toEqual(service)
		})
	})
})
