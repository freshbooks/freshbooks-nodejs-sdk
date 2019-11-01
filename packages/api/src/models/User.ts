/* eslint-disable @typescript-eslint/camelcase */
import Error from './Error'

export default interface User {
	id: string
	firstName: string
	lastName: string
}

export function transformUserResponse(data: string): User | Error {
	const { response, error, error_description } = JSON.parse(data)

	if (error) {
		return {
			code: error,
			message: error_description,
		}
	}

	return {
		id: response.id,
		firstName: response.first_name,
		lastName: response.last_name,
	}
}
