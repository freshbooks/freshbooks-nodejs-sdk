/* eslint-disable @typescript-eslint/camelcase */
import { isAccountingErrorResponse, transformAccountingErrorResponse, ErrorResponse } from './Error'
import VisState from './VisState'
import Pagination from './Pagination'
import { Nullable } from './helpers'
import Money, { transformMoneyParsedRequest } from './Money'

export default interface Tasks {
	id?: number
	billable?: boolean
	description?: Nullable<string>
	name?: Nullable<string>
	rate?: Money
	taskid?: number
	tname?: Nullable<string>
	tdesc?: Nullable<string>
	visState?: VisState
	updated?: Date
}

export function transformTasksParsedResponse(task: any): Tasks {
	return {
		id: task.id,
		billable: task.billable,
		description: task.description,
		name: task.name,
		rate: task.rate,
		taskid: task.taskid,
		tname: task.tname,
		tdesc: task.tdesc,
		visState: task.visState,
		updated: task.updated,
	}
}

export function transformTasksResponse(data: string, headers: Array<string>, status: string): Tasks | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(status, response)) {
		return transformAccountingErrorResponse(response)
	}

	const { task } = response.response.result

	return transformTasksParsedResponse(task)
}

export function transformTasksListResponse(
	data: string,
	headers: Array<string>,
	status: string
): { tasks: Tasks[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(status, response)) {
		return transformAccountingErrorResponse(response)
	}

	const { tasks, per_page, total, page, pages } = response.response.result

	return {
		tasks: tasks.map((task: any): Tasks => transformTasksParsedResponse(task)),
		pages: {
			total,
			size: per_page,
			pages,
			page,
		},
	}
}

export function transformTasksRequest(task: Tasks): string {
	return JSON.stringify({
		task: {
			id: task.id,
			billable: task.billable,
			description: task.description,
			name: task.name,
			rate: task.rate && transformMoneyParsedRequest(task.rate),
			taskid: task.taskid,
			tname: task.tname,
			tdesc: task.tdesc,
			visState: task.visState,
			updated: task.updated,
		},
	})
}
