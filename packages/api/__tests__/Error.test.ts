/* eslint-disable @typescript-eslint/camelcase */
import { isErrorResponse, transformErrorResponse } from '../src/models/Error'

describe('@freshbooks/api', () => {
	describe('Error', () => {
		test('isErrorResponse', () => {
			const errorResponses = [
				{
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
				{
					error: 'unauthenticated',
					error_description: 'This action requires authentication to continue.',
				},
				{
					error_type: 'not_found',
					message: 'The requested resource was not found.',
				},
			]

			errorResponses.forEach(response => {
				expect(isErrorResponse(response)).toBeTruthy()
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
						error_description:
							'This action requires authentication to continue.',
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
			]
			testCases.forEach(testCase => {
				expect(transformErrorResponse(testCase.input)).toEqual(
					testCase.expected
				)
			})
		})
	})
})
