/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import APIClient, { Options } from '../src/APIClient'
import { TimeEntry } from '../src/models'

const mock = new MockAdapter(axios) // set mock adapter on default axios instance

const BUSINESS_ID = 12345
const TIME_ENTRY_ID = 218192
const APPLICATION_CLIENT_ID = 'test-client-id'
const testOptions: Options = { accessToken: 'token' }

const buildTimeEntryResponse = (timeEntryResponseProperties: any = {}): any => ({
	id: TIME_ENTRY_ID,
	identity_id: 6600,
	is_logged: true,
	started_at: '2020-10-24T20:00:00Z',
	created_at: '2020-10-17T01:09:41Z',
	client_id: 4321,
	project_id: null,
	pending_client: null,
	pending_project: null,
	pending_task: null,
	task_id: null,
	service_id: null,
	note: 'Some note',
	active: false,
	billable: true,
	billed: false,
	internal: false,
	retainer_id: null,
	duration: 7200,
	timer: null,
	...timeEntryResponseProperties,
})

const buildMockTimeEntryJSONResponse = (timeEntryResponseProperties: any = {}): string =>
	JSON.stringify({
		time_entry: buildTimeEntryResponse(timeEntryResponseProperties),
	})

const buildExpectedTimeEntryResult = (timeEntryProperties: any = {}): TimeEntry => ({
	id: TIME_ENTRY_ID,
	identityId: 6600,
	isLogged: true,
	startedAt: new Date('2020-10-24T20:00:00Z'),
	createdAt: new Date('2020-10-17T01:09:41Z'),
	clientId: 4321,
	projectId: null,
	pendingClient: null,
	pendingProject: null,
	pendingTask: null,
	taskId: null,
	serviceId: null,
	note: 'Some note',
	active: false,
	billable: true,
	billed: false,
	internal: false,
	retainerId: null,
	duration: 7200,
	timer: null,
	...timeEntryProperties,
})

describe('@freshbooks/api', () => {
	describe('TimeEntry', () => {
		test('GET /timetracking/business/<businessId>/time_entries', async () => {
			const APIclient = new APIClient(APPLICATION_CLIENT_ID, testOptions)
			const response = `{
		    "meta": {
                "total": 1,
                "per_page": 30,
                "page": 1,
                "pages": 1
            },
		    "time_entries": [
		        ${JSON.stringify(buildTimeEntryResponse())}
		    ]
		    }`
			const expected = {
				timeEntries: [buildExpectedTimeEntryResult()],
				pages: {
					page: 1,
					pages: 1,
					size: 30,
					total: 1,
				},
			}

			mock.onGet(`/timetracking/business/${BUSINESS_ID}/time_entries`).replyOnce(200, response)

			const { data } = await APIclient.timeEntries.list(BUSINESS_ID)
			expect(data).toEqual(expected)
		})

		test('GET /timetracking/business/<businessId>/time_entries/<timeEntryId>', async () => {
			const APIclient = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const mockResponse = buildMockTimeEntryJSONResponse()

			mock.onGet(`/timetracking/business/${BUSINESS_ID}/time_entries/${TIME_ENTRY_ID}`).replyOnce(200, mockResponse)

			const expected = buildExpectedTimeEntryResult()

			const { data } = await APIclient.timeEntries.single(BUSINESS_ID, TIME_ENTRY_ID)

			expect(expected).toEqual(data)
		})

		test('POST /timetracking/business/<businessId>/time_entries', async () => {
			const APIclient = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const timeEntryModel = {
				clientId: 9876,
				internal: true,
				isLogged: true,
				startedAt: new Date('2020-01-21T10:00:00.000Z'),
				duration: 360,
			}
			const mockResponse = buildMockTimeEntryJSONResponse({
				client_id: 9876,
				internal: true,
				is_logged: true,
				started_at: '2020-01-21T10:00:00.000Z',
				duration: 360,
				timer: null,
			})

			const mockRequest = {
				time_entry: {
					is_logged: true,
					started_at: '2020-01-21T10:00:00.000Z',
					client_id: 9876,
					internal: true,
					duration: 360,
				},
			}

			mock.onPost(`/timetracking/business/${BUSINESS_ID}/time_entries`, mockRequest).reply(200, mockResponse)
			const expected = buildExpectedTimeEntryResult(timeEntryModel)

			const { data } = await APIclient.timeEntries.create(timeEntryModel, BUSINESS_ID)

			expect(data).toEqual(expected)
		})
	})

	test('PUT /timetracking/business/<businessId>/time_entries/<timeEntryId>', async () => {
		const APIclient = new APIClient(APPLICATION_CLIENT_ID, testOptions)

		const mockResponse = buildMockTimeEntryJSONResponse({
			started_at: '2020-01-21T10:00:00.000Z',
			duration: 680,
			timer: null,
		})

		const mockRequest = {
			time_entry: {
				is_logged: true,
				started_at: '2020-01-21T10:00:00.000Z',
				duration: 680,
			},
		}

		mock
			.onPut(`/timetracking/business/${BUSINESS_ID}/time_entries/${TIME_ENTRY_ID}`, mockRequest)
			.replyOnce(200, mockResponse)

		const timeEntryModel = {
			isLogged: true,
			startedAt: new Date('2020-01-21T10:00:00.000Z'),
			duration: 680,
		}

		const expected = buildExpectedTimeEntryResult(timeEntryModel)

		const { data } = await APIclient.timeEntries.update(timeEntryModel, BUSINESS_ID, TIME_ENTRY_ID)

		expect(data).toEqual(expected)
	})

	test('DELETE /timetracking/business/<businessId>/time_entries/<timeEntryId>', async () => {
		const APIclient = new APIClient(APPLICATION_CLIENT_ID, testOptions)

		mock.onDelete(`/timetracking/business/${BUSINESS_ID}/time_entries/${TIME_ENTRY_ID}`).replyOnce(204, {})

		const { data } = await APIclient.timeEntries.delete(BUSINESS_ID, TIME_ENTRY_ID)
		expect(data).toEqual({})
	})
})
