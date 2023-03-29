import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import APIClient, { Options } from '../src/APIClient'
import { Tasks } from '../src/models'
import { SearchQueryBuilder } from '../src/models/builders/SearchQueryBuilder'
import { joinQueries } from '../src/models/builders'

const mock = new MockAdapter(axios) // set mock adapter on default axios instance
const APPLICATION_CLIENT_ID = 'test-client-id'
const testOptions: Options = { accessToken: 'token' }

const ACCOUNT_ID = 'zDmNq'
const TASK_ID = 43221133

const buildTasksResponse = (taskResponseProperties: any = {}): any => ({
	id: TASK_ID,
	billable: true,
	description: '',
	name: 'Walking Dogs',
	rate: {
		amount: '25.47',
		code: 'CAD',
	},
	taskid: TASK_ID,
	tname: 'Walking Dogs',
	tdesc: '',
	visState: 0,
	updated: '2017-07-24 10:09:18',
	...taskResponseProperties,
})

const buildMockTasksJSONResponse = (taskResponseProperties: any = {}): string =>
	JSON.stringify({
		response: {
			result: {
				task: buildTasksResponse(taskResponseProperties),
			},
		},
	})

const buildExpectedTasksResult = (taskProperties: any = {}): Tasks => ({
	id: TASK_ID,
	billable: true,
	description: '',
	name: 'Walking Dogs',
	rate: {
		amount: '25.47',
		code: 'CAD',
	},
	taskid: TASK_ID,
	tname: 'Walking Dogs',
	tdesc: '',
	visState: 0,
	updated: '2017-07-24 10:09:18',
	...taskProperties,
})

describe('@freshbooks/api', () => {
	describe('Tasks', () => {
		test('GET /accounting/account/<account_id>/projects/tasks list', async () => {
			const APIclient = new APIClient(APPLICATION_CLIENT_ID, testOptions)
			const response = `
              {
                "response": {
                  "result": {
                    "tasks": [
                      ${JSON.stringify(buildTasksResponse())}
                    ],
                    "page": 1,
                    "pages": 1,
                    "per_page": 15,
                    "total": 1
                  }
                }
              }
              `
			const expected = {
				tasks: [buildExpectedTasksResult()],
				pages: {
					page: 1,
					pages: 1,
					size: 15,
					total: 1,
				},
			}
			const builder = new SearchQueryBuilder().like('name', 'Walking Dogs').equals('id', '43221133')
			const qs = joinQueries([builder])
			mock.onGet(`/accounting/account/${ACCOUNT_ID}/projects/tasks${qs}`).replyOnce(200, response)

			const { data } = await APIclient.tasks.list(ACCOUNT_ID, [builder])
			expect(data).toEqual(expected)
		})
		test('GET /accounting/account/<account_id>/projects/tasks/<task_id>', async () => {
			const APIclient = new APIClient(APPLICATION_CLIENT_ID, testOptions)
			const response = buildMockTasksJSONResponse()
			const expected = buildExpectedTasksResult()

			mock.onGet(`/accounting/account/${ACCOUNT_ID}/projects/tasks/${TASK_ID}`).replyOnce(200, response)

			const { data } = await APIclient.tasks.single(ACCOUNT_ID, TASK_ID)
			expect(data).toEqual(expected)
		})

		test('POST /accounting/account/<accountId>/projects/tasks create', async () => {
			const APIclient = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const taskModel = {
				name: 'Walking Dogs',
				rate: {
					amount: '25.47',
					code: 'CAD',
				},
				tname: 'Walking Dogs',
				tdesc: '',
				visState: 0,
			}
			const mockResponse = buildMockTasksJSONResponse()

			const mockRequest = {
				task: {
					name: 'Walking Dogs',
					rate: {
						amount: '25.47',
						code: 'CAD',
					},
					tname: 'Walking Dogs',
					tdesc: '',
					visState: 0,
				},
			}

			const expected = buildExpectedTasksResult()

			mock.onPost(`/accounting/account/${ACCOUNT_ID}/projects/tasks`, mockRequest).replyOnce(200, mockResponse)

			const { data } = await APIclient.tasks.create(taskModel, ACCOUNT_ID)
			expect(data).toEqual(expected)
		})
		test('PUT /accounting/account/<accountId>/projects/tasks/<taskId> update', async () => {
			const APIclient = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const mockResponse = buildMockTasksJSONResponse({ description: 'Something' })

			const mockRequest = {
				task: {
					description: 'Something',
				},
			}

			const taskModel = {
				description: 'Something',
			}

			const expected = buildExpectedTasksResult({ description: 'Something' })

			mock
				.onPut(`/accounting/account/${ACCOUNT_ID}/projects/tasks/${TASK_ID}`, mockRequest)
				.replyOnce(200, mockResponse)

			const { data } = await APIclient.tasks.update(taskModel, ACCOUNT_ID, TASK_ID)
			expect(data).toEqual(expected)
		})
		test('PUT /accounting/account/<accountId>/projects/tasks/<taskId> delete', async () => {
			const APIclient = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const mockResponse = buildMockTasksJSONResponse({ visState: 1 })

			const mockRequest = {
				task: {
					visState: 1,
				},
			}

			const expected = buildExpectedTasksResult({ visState: 1 })

			mock
				.onPut(`/accounting/account/${ACCOUNT_ID}/projects/tasks/${TASK_ID}`, mockRequest)
				.replyOnce(200, mockResponse)

			const { data } = await APIclient.tasks.delete(ACCOUNT_ID, TASK_ID)
			expect(data).toEqual(expected)
		})
	})
})
