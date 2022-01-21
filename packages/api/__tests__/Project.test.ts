/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import APIClient, { Options } from '../src/APIClient'
import { Project } from '../src/models'

const mock = new MockAdapter(axios) // set mock adapter on default axios instance

const BUSINESS_ID = 12345
const PROJECT_ID = 218192
const APPLICATION_CLIENT_ID = 'test-client-id'
const testOptions: Options = { accessToken: 'token' }

const buildProjectResponse = (projectResponseProperties: any = {}): any => ({
	id: PROJECT_ID,
	title: 'Some project',
	description: 'a project...of doom',
	due_date: '2020-10-24',
	client_id: 4321,
	internal: false,
	budget: '50.00',
	fixed_price: null,
	rate: '5.00',
	billing_method: 'project_rate',
	project_type: 'hourly_rate',
	project_manager_id: null,
	active: true,
	complete: false,
	sample: false,
	created_at: '2020-10-17T01:09:41Z',
	updated_at: '2020-10-24T20:00:00Z',
	logged_duration: null,
	services: [
		{
			business_id: BUSINESS_ID,
			id: 1234,
			name: 'A Cool Service I Provide',
			billable: true,
			vis_state: 0,
		},
	],
	billed_amount: '5.00',
	billed_status: 'partially_billed',
	retainer_id: null,
	expense_markup: 0,
	groupId: 6543,
	group: {
		id: 6543,
		members: [
			{
				first_name: 'Gordon',
				last_name: 'Shumway',
				role: 'owner',
				identity_id: 7654,
				active: true,
				company: 'American Cyanamid',
				id: 12,
				email: 'alf@american-cyanamid.com',
			},
		],
	},
	...projectResponseProperties,
})

const buildMockProjectJSONResponse = (projectResponseProperties: any = {}): string =>
	JSON.stringify({
		project: buildProjectResponse(projectResponseProperties),
	})

const buildExpectedProjectResult = (projectProperties: any = {}): Project => ({
	id: PROJECT_ID,
	title: 'Some project',
	description: 'a project...of doom',
	dueDate: new Date('2020-10-24T00:00:00'),
	clientId: 4321,
	internal: false,
	budget: '50.00',
	fixedPrice: null,
	rate: '5.00',
	billingMethod: 'project_rate',
	projectType: 'hourly_rate',
	projectManagerId: null,
	active: true,
	complete: false,
	sample: false,
	createdAt: new Date('2020-10-17T01:09:41Z'),
	updatedAt: new Date('2020-10-24T20:00:00Z'),
	loggedDuration: null,
	services: [
		{
			businessId: BUSINESS_ID,
			id: 1234,
			name: 'A Cool Service I Provide',
			billable: true,
			visState: 0,
		},
	],
	billedAmount: '5.00',
	billedStatus: 'partially_billed',
	retainerId: null,
	expenseMarkup: 0,
	groupId: undefined,
	group: {
		id: 6543,
		members: [
			{
				firstName: 'Gordon',
				lastName: 'Shumway',
				role: 'owner',
				identityId: 7654,
				active: true,
				company: 'American Cyanamid',
				id: 12,
				email: 'alf@american-cyanamid.com',
			},
		],
	},
	...projectProperties,
})

describe('@freshbooks/api', () => {
	describe('Projects', () => {
		test('GET /projects/business/<businessId>/projects', async () => {
			const APIclient = new APIClient(APPLICATION_CLIENT_ID, testOptions)
			const response = `{
		    "meta": {
                "total": 1,
                "per_page": 30,
                "page": 1,
                "pages": 1
            },
		    "projects": [
		        ${JSON.stringify(buildProjectResponse())}
		    ]
		    }`
			const expected = {
				projects: [buildExpectedProjectResult()],
				pages: {
					page: 1,
					pages: 1,
					size: 30,
					total: 1,
				},
			}

			mock.onGet(`/projects/business/${BUSINESS_ID}/projects`).replyOnce(200, response)

			const { data } = await APIclient.projects.list(BUSINESS_ID)
			expect(data).toEqual(expected)
		})

		test('GET /projects/business/<businessId>/projects/<projectId>', async () => {
			const APIclient = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const mockResponse = buildMockProjectJSONResponse()

			mock.onGet(`/projects/business/${BUSINESS_ID}/project/${PROJECT_ID}`).replyOnce(200, mockResponse)

			const expected = buildExpectedProjectResult()

			const { data } = await APIclient.projects.single(BUSINESS_ID, PROJECT_ID)

			expect(expected).toEqual(data)
		})

		test('POST /projects/business/<businessId>/project', async () => {
			const APIclient = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const projectModel = {
				title: 'Some project',
				description: 'a project...of doom',
			}
			const mockResponse = buildMockProjectJSONResponse()

			const mockRequest = {
				project: {
					title: 'Some project',
					description: 'a project...of doom',
				},
			}

			mock.onPost(`/projects/business/${BUSINESS_ID}/project`, mockRequest).reply(200, mockResponse)
			const expected = buildExpectedProjectResult(projectModel)

			const { data } = await APIclient.projects.create(projectModel, BUSINESS_ID)

			expect(data).toEqual(expected)
		})
	})

	test('PUT /projects/business/<businessId>/project/<projectId>', async () => {
		const APIclient = new APIClient(APPLICATION_CLIENT_ID, testOptions)

		const mockResponse = buildMockProjectJSONResponse({
			title: 'Some changed project',
		})

		const mockRequest = {
			project: {
				title: 'Some changed project',
			},
		}

		mock.onPut(`/projects/business/${BUSINESS_ID}/project/${PROJECT_ID}`, mockRequest).replyOnce(200, mockResponse)

		const projectModel = {
			title: 'Some changed project',
		}

		const expected = buildExpectedProjectResult(projectModel)

		const { data } = await APIclient.projects.update(projectModel, BUSINESS_ID, PROJECT_ID)

		expect(data).toEqual(expected)
	})

	test('DELETE /projects/business/<businessId>/project/<projectId>', async () => {
		const APIclient = new APIClient(APPLICATION_CLIENT_ID, testOptions)

		mock.onDelete(`/projects/business/${BUSINESS_ID}/project/${PROJECT_ID}`).replyOnce(204, {})

		const { data } = await APIclient.projects.delete(BUSINESS_ID, PROJECT_ID)
		expect(data).toEqual({})
	})
})
