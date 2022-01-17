import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import APIClient, { Options } from '../src/APIClient'

const mock = new MockAdapter(axios) // set mock adapter on default axios instance
const APPLICATION_CLIENT_ID = 'test-client-id'
const testOptions: Options = { accessToken: 'token' }

describe('@freshbooks/api', () => {
	describe('User', () => {
		test('GET /users/me', async () => {
			const client = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const mockResponse = `{
					"response":{
					   "id":2192788,
					   "first_name":"Johnny",
					   "last_name":"Appleseed",
					   "email":"johnnyappleseed@test.com",
					   "language":"en",
					   "created_at":"2019-06-05T15:42:54Z",
					   "phone_numbers":[
						  {
							 "title":"",
							 "phone_number":null
						  }
					   ],
					   "addresses":[
						  null
					   ],
					   "profession":{
						  "id":2609324,
						  "business_id":2122866,
						  "title":"Apple Consulting",
						  "company":"Fruity Loops",
						  "designation":null
					   },
					   "links":{
						  "me":"/service/auth/api/v1/users?id=2192788",
						  "roles":"/service/auth/api/v1/users/role/2192788"
					   },
					   "permissions":{
						  "xZNQ1X":{
							 "advanced_accounting.access":true,
							 "attachments.access":true,
							 "business_accountant.limit":10,
							 "client.limit":-1,
							 "proposals_candidate.access":true,
							 "retainers_feature.access":true,
							 "retainers.limit":-1,
							 "rich_proposals.access":true,
							 "staff.limit":-1,
							 "BetaHeliosAsyncExpenses.access":true,
							 "beta_mobile_create_expense_subcategory.access":true,
							 "ios_beta_zendesk_widget.access":true,
							 "mobile_receipt_rebilling.access":true,
							 "helios_pushnotifications.beta.access":true,
							 "ios_beta_payment_schedules.access":true,
							 "helios_rebill_time.access":true,
							 "esignatures.access":true,
							 "helios_dashboard.access":true,
							 "helios_late_fee_reminder.beta.access":true,
							 "helios_bulk_actions_invoices.beta.access":true,
							 "auto_bank_import.access":true,
							 "helios_virtual_terminal.beta.access":true,
							 "helios_expense_rebilling.beta.access":true,
							 "helios_company_taxes.beta.access":true,
							 "helios_invoice_archive.beta.access":true,
							 "accountant_invite.access":true,
							 "premium_contractor_role.access":true,
							 "helios_sync_throttle.beta.access":true,
							 "retainers.access":true,
							 "BankReconciliation.access":true,
							 "helios_push_resource_to_use_execute.beta.access":true,
							 "new_time_tracking.access":true,
							 "bank_rec_smart_match.access":true,
							 "invoice_v2_search.access":true,
							 "import_items_csv.access":true,
							 "helios_remote_search.beta.access":true,
							 "export_clients_csv.access":true,
							 "helios_virtual_terminal_tutorial.beta.access":true,
							 "helios_virtual_terminal_advertising.beta.access":true,
							 "clients_v2_search.access":true,
							 "retainer_contractor_time.access":true,
							 "helios_stripe_virtual_terminal.beta.access":true,
							 "invoice_v3_search.access":true,
							 "invoice_profile_v2_search.access":true,
							 "business_manager_role.access":true,
							 "billable_items_v2.access":true,
							 "invoices_single_line_actions.access":true,
							 "whats_new_widget.access":true,
							 "payroll_integration.access":true,
							 "improved_profit_and_loss_report.access":true,
							 "chase_dao.access":true,
							 "estimate_v3_search.access":true
						  },
						  "3xQ74o":{
							 "advanced_accounting.access":true,
							 "attachments.access":true,
							 "business_accountant.limit":10,
							 "client.limit":-1,
							 "proposals_candidate.access":true,
							 "retainers_feature.access":true,
							 "retainers.limit":-1,
							 "rich_proposals.access":true,
							 "staff.limit":-1,
							 "BetaHeliosAsyncExpenses.access":true,
							 "beta_mobile_create_expense_subcategory.access":true,
							 "ios_beta_zendesk_widget.access":true,
							 "mobile_receipt_rebilling.access":true,
							 "helios_pushnotifications.beta.access":true,
							 "ios_beta_payment_schedules.access":true,
							 "helios_rebill_time.access":true,
							 "esignatures.access":true,
							 "helios_dashboard.access":true,
							 "helios_late_fee_reminder.beta.access":true,
							 "helios_bulk_actions_invoices.beta.access":true,
							 "auto_bank_import.access":true,
							 "helios_virtual_terminal.beta.access":true,
							 "helios_expense_rebilling.beta.access":true,
							 "helios_company_taxes.beta.access":true,
							 "helios_invoice_archive.beta.access":true,
							 "accountant_invite.access":true,
							 "helios_sync_throttle.beta.access":true,
							 "retainers.access":true,
							 "BankReconciliation.access":true,
							 "helios_push_resource_to_use_execute.beta.access":true,
							 "new_time_tracking.access":true,
							 "bank_rec_smart_match.access":true,
							 "invoice_v2_search.access":true,
							 "import_items_csv.access":true,
							 "helios_remote_search.beta.access":true,
							 "export_clients_csv.access":true,
							 "helios_virtual_terminal_tutorial.beta.access":true,
							 "helios_virtual_terminal_advertising.beta.access":true,
							 "clients_v2_search.access":true,
							 "retainer_contractor_time.access":true,
							 "helios_stripe_virtual_terminal.beta.access":true,
							 "invoice_v3_search.access":true,
							 "invoice_profile_v2_search.access":true,
							 "business_manager_role.access":true,
							 "billable_items_v2.access":true,
							 "invoices_single_line_actions.access":true,
							 "whats_new_widget.access":true,
							 "payroll_integration.access":true,
							 "improved_profit_and_loss_report.access":true,
							 "chase_dao.access":true,
							 "estimate_v3_search.access":true
						  }
					   },
					   "groups":[
						  {
							 "id":6765686,
							 "group_id":5206502,
							 "role":"owner",
							 "identity_id":2192788,
							 "business_id":2122866,
							 "active":true
						  },
						  {
							 "id":7900914,
							 "group_id":6157078,
							 "role":"owner",
							 "identity_id":2192788,
							 "business_id":2603988,
							 "active":true
						  }
					   ],
					   "subscription_statuses":{
						  "xZNQ1X":"active_trial",
						  "3xQ74o":"active_trial"
					   },
					   "integrations":{
						  "google":{
							 "domain":"secretmission.io",
							 "email_address":"bhaskar@secretmission.io",
							 "has_password":false,
							 "is_active":true
						  }
					   },
					   "business_memberships":[
						  {
							 "id":6765686,
							 "role":"owner",
							 "unacknowledged_change":false,
							 "fasttrack_token":"eyJhbGciOiJIUzI1NiJ9.eyJmYXN0dHJhY2tfaWRlbnRpdHlfaWQiOiIyMTkyNzg4IiwiZmFzdHRyYWNrX3N5c3RlbV9pZCI6IjQzNTQ3NjQiLCJmYXN0dHJhY2tfYnVzaW5lc3NfaWQiOiIyMTIyODY2IiwiY3JlYXRlZF9hdCI6IjIwMTktMTEtMTJUMTY6NTg6MTArMDA6MDAifQ.9nfovmVa3X-iqu3ccThjtByZEGJSLujayQR8kW1rP1s",
							 "business":{
								"id":2122866,
								"business_uuid":"046e4001-0002-616d-710a-a451d4421b13",
								"name":"Fruity Loops",
								"account_id":"xZNQ1X",
								"date_format":"mm/dd/yyyy",
								"address":{
								   "id":3383026,
								   "street":"20 Fake St.",
								   "city":"Toronto",
								   "province":"Ontario",
								   "country":"Canada",
								   "postal_code":"1I2K4J"
								},
								"phone_number":{
								   "id":1039134,
								   "phone_number":"5555555555"
								},
								"business_clients":[

								]
							 }
						  },
						  {
							 "id":7900914,
							 "role":"owner",
							 "unacknowledged_change":false,
							 "fasttrack_token":"eyJhbGciOiJIUzI1NiJ9.eyJmYXN0dHJhY2tfaWRlbnRpdHlfaWQiOiIyMTkyNzg4IiwiZmFzdHRyYWNrX3N5c3RlbV9pZCI6IjQ3MTQ3NDAiLCJmYXN0dHJhY2tfYnVzaW5lc3NfaWQiOiIyNjAzOTg4IiwiY3JlYXRlZF9hdCI6IjIwMTktMTEtMTJUMTY6NTg6MTArMDA6MDAifQ.v01c33WuVR4Zc8OtSc3epP1MNaDCuEhNZIlYlJ7ZvD4",
							 "business":{
								"id":2603988,
								"business_uuid":"04710001-0002-ff38-0de2-a77e0c34a9a1",
								"name":"Other business",
								"account_id":"3xQ74o",
								"date_format":"mm/dd/yyyy",
								"address":{
								   "id":3292884,
								   "street":null,
								   "city":null,
								   "province":null,
								   "country":"Canada",
								   "postal_code":null
								},
								"phone_number":null,
								"business_clients":[

								]
							 }
						  }
					   ],
					   "identity_origin":"magnum",
					   "roles":[
						  {
							 "id":2290862,
							 "role":"admin",
							 "systemid":4354764,
							 "userid":1,
							 "created_at":"2019-06-05T15:42:54Z",
							 "links":{
								"destroy":"/service/auth/api/v1/users/role/2290862"
							 },
							 "accountid":"xZNQ1X"
						  },
						  {
							 "id":2802256,
							 "role":"admin",
							 "systemid":4714740,
							 "userid":1,
							 "created_at":"2019-10-23T19:18:36Z",
							 "links":{
								"destroy":"/service/auth/api/v1/users/role/2802256"
							 },
							 "accountid":"3xQ74o"
						  }
					   ]
					}
				 }`

			mock.onGet(`/auth/api/v1/users/me`).replyOnce(200, mockResponse)

			const { data } = await client.users.me()

			const expected = {
				id: '2192788',
				firstName: 'Johnny',
				lastName: 'Appleseed',
				email: 'johnnyappleseed@test.com',
				phoneNumbers: expect.arrayContaining([
					{
						title: '',
						number: null,
					},
				]),
				addresses: [],
				profession: expect.objectContaining({
					id: '2609324',
					businessId: '2122866',
					title: 'Apple Consulting',
					company: 'Fruity Loops',
				}),
				businessMemberships: expect.arrayContaining([
					expect.objectContaining({
						business: expect.objectContaining({
							id: 2122866,
							accountId: 'xZNQ1X',
						}),
					}),
				]),
				groups: expect.arrayContaining([
					expect.objectContaining({
						id: 6765686,
						groupId: 5206502,
						role: 'owner',
						identityId: 2192788,
						businessId: 2122866,
						active: true,
					}),
					expect.objectContaining({
						id: 7900914,
						groupId: 6157078,
						role: 'owner',
						identityId: 2192788,
						businessId: 2603988,
						active: true,
					}),
				]),
				links: expect.objectContaining({
					me: '/service/auth/api/v1/users?id=2192788',
					roles: '/service/auth/api/v1/users/role/2192788',
				}),
			}

			expect(data).toEqual(expect.objectContaining(expected))
		})
	})
})
