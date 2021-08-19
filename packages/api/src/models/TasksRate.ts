// COULD WE NOT JUST USE MONEY FOR THIS? The only issue with Money is that the amount is a number
// For the tasks api rate is specified with amount as a string.

export default interface TasksRate {
	amount?: string
	code?: string
}

export interface TasksRateResponse {
	amount: string
	code: string
}

/**
 * Format a TasksRate response object
 * @param data Account business object
 * eg: { "amount": "1234.00", "code": "USD" }
 * @returns TasksRate object
 */
export function transformTasksRateResponse({ amount, code }: TasksRateResponse): TasksRate {
	return {
		amount,
		code,
	}
}

/**
 * Parse a JSON string to @TasksRate object
 * @param json JSON string
 * eg: '{
 *          "amount": "1234.00",
 *          "code": "USD"
 *      }'
 * @returns TasksRate object
 */
export function transformTasksRateJSON(json: string): TasksRate {
	const response: TasksRateResponse = JSON.parse(json)
	return transformTasksRateResponse(response)
}

export function transformTasksRateRequest({ amount, code }: TasksRate = {}): any {
	return {
		amount,
		code,
	}
}
