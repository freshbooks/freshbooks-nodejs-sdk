/* eslint-disable @typescript-eslint/camelcase */
import { isAccountingErrorResponse, isProjectErrorResponse, transformErrorResponse } from '../src/models/Error'

describe('@freshbooks/api', () => {
	describe('Error', () => {
		test('isAccountingErrorResponse true', () => {
			const errorResponses = [
				{
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
				},
				{
					errorStatus: '401',
					errorResponse: {
						response: {
							result: {
								some: 'content',
							},
						},
					},
				},
			]

			errorResponses.forEach((error) => {
				expect(isAccountingErrorResponse(error.errorStatus, error.errorResponse)).toBeTruthy()
			})
		})

		test('isAccountingErrorResponse false', () => {
			const errorResponse = {
				response: {
					result: {
						some: 'content',
					},
				},
			}
			expect(isAccountingErrorResponse('200', errorResponse)).toBeFalsy()
		})

		test('isProjectErrorResponse', () => {
			const errorResponses = [
				{
					error: 'Requested resource could not be found.',
				},
				{
					errno: 2001,
					error: {
						started_at: 'field required',
						duraction: 'Logged entries must have a duration',
					},
				},
				{
					error: 'unauthenticated',
					error_description: 'This action requires authentication to continue.',
				},
				{
					error_type: 'not_found',
					message: 'The requested resource was not found.',
				},
			]

			errorResponses.forEach((response) => {
				expect(isProjectErrorResponse(response)).toBeTruthy()
			})
		})

		test('transformErrorResponse', () => {
			const testCases = [
				{
					input: {
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
								number: 1012,
								field: 'itemid',
								message: 'Item not found.',
								object: 'item',
								value: '123432',
							},
						],
					},
				},
				{
					input: {
						error: 'unauthenticated',
						error_description: 'This action requires authentication to continue.',
					},
					expected: {
						code: 'unauthenticated',
						message: 'This action requires authentication to continue.',
					},
				},
				{
					input: {
						error_type: 'not_found',
						message: 'The requested resource was not found.',
					},
					expected: {
						code: 'not_found',
						message: 'The requested resource was not found.',
					},
				},
				{
					input: {
						error: 'Requested resource could not be found.',
					},
					expected: {
						code: undefined,
						message: 'Requested resource could not be found.',
					},
				},
				{
					input: {
						errno: 2001,
						error: {
							started_at: 'field required',
							duration: 'Logged entries must have a duration',
						},
					},
					expected: {
						code: 2001,
						errors: [
							{
								number: 2001,
								field: 'started_at',
								message: 'field required',
							},
							{
								number: 2001,
								field: 'duration',
								message: 'Logged entries must have a duration',
							},
						],
					},
				},
			]
			testCases.forEach((testCase) => {
				expect(transformErrorResponse(testCase.input)).toEqual(testCase.expected)
			})
		})
	})
})
