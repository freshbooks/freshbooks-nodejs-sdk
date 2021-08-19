import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import APIClient, { Options } from '../src/APIClient'
import { Tasks } from '../src/models'

const mock = new MockAdapter(axios) // set mock adapter on default axios instance
const testOptions: Options = { clientId: 'test-client-id' }

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
		test('GET /accounting/account/<account_id>/projects/tasks/<task_id>', async () => {
			const token = 'token'
			const APIclient = new APIClient(token, testOptions)
			const response = buildMockTasksJSONResponse()
			const expected = buildExpectedTasksResult()

			mock.onGet(`/accounting/account/${ACCOUNT_ID}/projects/tasks/${TASK_ID}`).replyOnce(200, response)

			const { data } = await APIclient.tasks.single(ACCOUNT_ID, TASK_ID)
			expect(data).toEqual(expected)
		})

		test('POST /accounting/account/<accountId>/projects/tasks create', async () => {
			const token = 'token'
			const APIclient = new APIClient(token, testOptions)

			const taskModel = {
				name: 'Walking Dogs',
				rate: {
					amount: '25.47',
					code: 'CAD',
				},
				tname: 'Walking Dogs',
				tdesc: '',
				visState: 0,
				updated: '2017-07-24 10:09:18',
			}
			const mockResponse = buildMockTasksJSONResponse({ taskModel })

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
					updated: '2017-07-24 10:09:18',
				},
			}

			mock.onPost(`/accounting/account/${ACCOUNT_ID}/projects/tasks`, mockRequest).replyOnce(200, mockResponse)

			const expected = buildExpectedTasksResult(taskModel)

			const { data } = await APIclient.tasks.create(taskModel, ACCOUNT_ID)

			expect(data).toEqual(expected)
		})
	})
	test('PUT /accounting/account/<accountId>/projects/tasks/<taskId> update', async () => {
		const token = 'token'
		const APIclient = new APIClient(token, testOptions)

		const taskModel = {
			name: 'Walking Dogs',
			rate: {
				amount: '25.47',
				code: 'CAD',
			},
			tname: 'Walking Dogs',
			tdesc: '',
			visState: 0,
			updated: '2017-07-24 10:09:18',
		}
		const mockResponse = buildMockTasksJSONResponse({ desc: 'Something' })

		const mockRequest = {
			task: {
				desc: 'Something',
			},
		}

		const expected = buildExpectedTasksResult({ desc: 'Something' })

		mock.onPut(`/accounting/account/${ACCOUNT_ID}/projects/tasks/${TASK_ID}`, mockRequest).replyOnce(200, mockResponse)

		const { data } = await APIclient.tasks.update(taskModel, ACCOUNT_ID, TASK_ID)
		expect(data).toEqual(expected)
	})
	test('PUT /accounting/account/<accountId>/projects/tasks/<taskId> delete', async () => {
		const token = 'token'
		const APIclient = new APIClient(token, testOptions)

		const taskModel = {
			name: 'Walking Dogs',
			rate: {
				amount: '25.47',
				code: 'CAD',
			},
			tname: 'Walking Dogs',
			tdesc: '',
			visState: 0,
			updated: '2017-07-24 10:09:18',
		}
		const mockResponse = buildMockTasksJSONResponse({ visState: 1 })

		const mockRequest = {
			task: {
				visState: 1,
			},
		}

		const expected = buildExpectedTasksResult({ visState: 1 })

		mock.onPut(`/accounting/account/${ACCOUNT_ID}/users/clients/${TASK_ID}`, mockRequest).replyOnce(200, mockResponse)

		const { data } = await APIclient.tasks.update(taskModel, ACCOUNT_ID, TASK_ID)
		expect(data).toEqual(expected)
	})
})
