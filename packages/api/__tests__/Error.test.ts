/* eslint-disable @typescript-eslint/camelcase */
import {
	isAccountingErrorResponse,
	isAuthErrorResponse,
	isEventErrorResponse,
	isOnlinePaymentErrorResponse,
	isProjectErrorResponse,
	transformAccountingErrorResponse,
	transformAuthErrorResponse,
	transformEventErrorResponse,
	transformOnlinePaymentsErrorResponse,
	transformProjectErrorResponse,
} from '../src/models/Error'

const accountingErrorResponses = [
	{
		// Old-style accounting error, regardless of status code
		errorStatus: '200',
		errorResponse: {
			response: {
				errors: [
					{
						errno: 1012,
						field: 'itemid',
						message: 'Item not found.',
						object: 'item',
						value: '123432',
					},
				],
			},
		},
		expected: {
			errors: [
				{
					message: 'Item not found.',
					errorCode: 1012,
					field: 'itemid',
					object: 'item',
					value: '123432',
				},
			],
		},
	},
	{
		// new-style accounting error
		errorStatus: '200',
		errorResponse: {
			code: 5,
			message: 'Request failed with status_code: 404',
			details: [
				{
					'@type': 'type.googleapis.com/google.rpc.ErrorInfo',
					reason: '1012',
					domain: 'accounting.api.freshbooks.com',
					metadata: {
						object: 'item',
						message: 'Item not found.',
						value: '123432',
						field: 'itemid',
					},
				},
			],
		},
		expected: {
			errors: [
				{
					message: 'Item not found.',
					errorCode: 1012,
					field: 'itemid',
					object: 'item',
					value: '123432',
				},
			],
		},
	},
	{
		// Error status code, but unexpected error payload
		errorStatus: '401',
		errorResponse: {
			response: {
				result: {
					some: 'content',
				},
			},
		},
		expected: {
			message: 'Returned an unexpected response',
		},
	},
]

const authErrorResponses = [
	{
		errorResponse: {
			// Token_info endpoint response
			error: 'invalid_token',
			error_description: 'The access token is invalid',
			state: 'unauthorized',
		},
		expected: {
			message: 'The access token is invalid',
		},
	},
	{
		errorResponse: {
			// Unauthenticated /me response
			error: 'unauthenticated',
			error_description: 'This action requires authentication to continue.',
		},
		expected: {
			message: 'This action requires authentication to continue.',
		},
	},
	{
		errorResponse: {
			// POST Validation error
			error: 'invalid_resource',
			error_description: 'Validation failed: Name has already been taken',
		},
		expected: {
			message: 'Validation failed: Name has already been taken',
		},
	},
]

describe('@freshbooks/api', () => {
	describe('Error', () => {
		test('isAccountingErrorResponse', () => {
			accountingErrorResponses.forEach((error) => {
				expect(isAccountingErrorResponse(error.errorStatus, error.errorResponse)).toBeTruthy()
			})

			const goodResponse = {
				response: {
					result: {
						some: 'content',
					},
				},
			}
			expect(isAccountingErrorResponse('200', goodResponse)).toBeFalsy()
		})

		test('transformAccountingErrorResponse', () => {
			accountingErrorResponses.forEach((testCase) => {
				expect(transformAccountingErrorResponse(testCase.errorResponse)).toEqual(testCase.expected)
			})
		})

		test('isAuthErrorResponse', () => {
			authErrorResponses.forEach((error) => {
				expect(isAuthErrorResponse('200', error.errorResponse)).toBeTruthy()
			})

			expect(isAuthErrorResponse('401', { some: 'content' })).toBeTruthy()
			expect(isAuthErrorResponse('200', { some: 'content' })).toBeFalsy()
		})

		test('transformAuthErrorResponse', () => {
			authErrorResponses.forEach((testCase) => {
				expect(transformAuthErrorResponse(testCase.errorResponse)).toEqual(testCase.expected)
			})

			expect(transformAuthErrorResponse({ some: 'content' })).toEqual({ message: 'Returned an unexpected response' })
		})

		test('isEventErrorResponse', () => {
			expect(isEventErrorResponse('200')).toBeFalsy()
			expect(isEventErrorResponse('400')).toBeTruthy()
		})

		test('transformEventErrorResponse', () => {
			const errorResponses = [
				{
					errorResponse: {
						code: 5,
						message: 'Requested resource could not be found.',
						details: [],
					},
					expected: {
						message: 'Requested resource could not be found.',
					},
				},
				{
					errorResponse: {
						code: 3,
						message: 'Invalid data in this request.',
						details: [
							{
								'@type': 'type.googleapis.com/google.rpc.BadRequest',
								fieldViolations: [
									{
										field: 'event',
										description: 'Unrecognized event.',
									},
									{
										field: 'uri',
										description: 'Not a well-formed URL.',
									},
								],
							},
							{
								'@type': 'type.googleapis.com/google.rpc.Help',
								links: [
									{
										description: 'API Documentation',
										url: 'https://www.freshbooks.com/api/webhooks',
									},
								],
							},
						],
					},
					expected: {
						errors: [
							{
								message: 'Unrecognized event.',
								field: 'event',
							},
							{
								message: 'Not a well-formed URL.',
								field: 'uri',
							},
						],
					},
				},
			]
			errorResponses.forEach((error) => {
				expect(transformEventErrorResponse(error.errorResponse)).toEqual(error.expected)
			})
		})

		test('isOnlinePaymentErrorResponse', () => {
			const errorResponses = [
				{
					error_type: 'unauthorized',
					message: 'Authentication is required to complete this request.',
				},
				{
					error_type: 'not_found',
					message: 'Resource not found',
				},
				{
					error_type: 'forbidden',
					message: 'Forbidden.',
				},
			]

			errorResponses.forEach((error) => {
				expect(isOnlinePaymentErrorResponse('200', error)).toBeTruthy()
			})

			expect(isOnlinePaymentErrorResponse('401', { some: 'content' })).toBeTruthy()
			expect(isOnlinePaymentErrorResponse('200', { some: 'content' })).toBeFalsy()
		})

		test('transformOnlinePaymentsErrorResponse', () => {
			const response = {
				error_type: 'unauthorized',
				message: 'Authentication is required to complete this request.',
			}

			const expected = { message: 'Authentication is required to complete this request.' }
			expect(transformOnlinePaymentsErrorResponse(response)).toEqual(expected)
		})

		test('isEventErrorResponse', () => {
			expect(isEventErrorResponse('200')).toBeFalsy()
			expect(isEventErrorResponse('400')).toBeTruthy()
		})

		test('isProjectErrorResponse', () => {
			const errorResponses = [
				//{
				//	message: 'invalid_token: The request token failed to authenticate or validate.',
				//},
				{
					error: 'Requested resource could not be found.',
				},
				{
					errno: 2001,
					error: {
						started_at: 'field required',
					},
				},
				{
					errno: 2001,
					error: {
						started_at: 'field required',
						duraction: 'Logged entries must have a duration',
					},
				},
				{
					errno: 2001,
					error: {
						started_at: 'field required',
						__root__: 'Logged entries must have a duration',
					},
				},
			]

			errorResponses.forEach((response) => {
				expect(isProjectErrorResponse('200', response)).toBeTruthy()
			})
			expect(isProjectErrorResponse('400', { some: 'content' })).toBeTruthy()
			expect(isProjectErrorResponse('200', { some: 'content' })).toBeFalsy()
		})

		test('transformProjectErrorResponse', () => {
			const errorResponses = [
				{
					errorResponse: {
						message: 'invalid_token: The request token failed to authenticate or validate.',
					},
					expected: {
						message: 'invalid_token: The request token failed to authenticate or validate.',
					},
				},
				{
					errorResponse: {
						error: 'Requested resource could not be found.',
					},
					expected: { message: 'Requested resource could not be found.' },
				},
				{
					errorResponse: {
						errno: 2001,
						error: {
							started_at: 'field required',
						},
					},

					expected: {
						errors: [
							{
								message: 'field required',
								errorCode: 2001,
								field: 'started_at',
							},
						],
					},
				},
				{
					errorResponse: {
						errno: 2001,
						error: {
							title: 'String must be 255 characters long or fewer',
							duraction: 'Logged entries must have a duration',
						},
					},
					expected: {
						errors: [
							{
								message: 'String must be 255 characters long or fewer',
								errorCode: 2001,
								field: 'title',
							},
							{
								message: 'Logged entries must have a duration',
								errorCode: 2001,
								field: 'duraction',
							},
						],
					},
				},
			]
			errorResponses.forEach((testCase) => {
				expect(transformProjectErrorResponse(testCase.errorResponse)).toEqual(testCase.expected)
			})

			expect(transformProjectErrorResponse({ some: 'content' })).toEqual({ message: 'Returned an unexpected response' })
		})
	})
})
