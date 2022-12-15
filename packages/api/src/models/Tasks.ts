/* eslint-disable @typescript-eslint/camelcase */
import { isAccountingErrorResponse, transformErrorResponse, ErrorResponse } from './Error'
import VisState from './VisState'
import Pagination from './Pagination'
import { Nullable } from './helpers'
import Money, { transformMoneyRequest } from './Money'

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

export function transformTasksResponse(data: string): Tasks | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { task } = response.response.result

	return transformTasksParsedResponse(task)
}

export function transformTasksListResponse(data: string): { tasks: Tasks[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { tasks, per_page, total, page, pages } = response.response.result

	return {
		tasks: tasks.map((task: any) => transformTasksParsedResponse(task)),
		pages: {
			total,
			size: per_page,
			pages,
			page,
		},
	}
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

export function transformTasksRequest(task: Tasks): string {
	return JSON.stringify({
		task: {
			id: task.id,
			billable: task.billable,
			description: task.description,
			name: task.name,
			rate: task.rate && transformMoneyRequest(task.rate),
			taskid: task.taskid,
			tname: task.tname,
			tdesc: task.tdesc,
			visState: task.visState,
			updated: task.updated,
		},
	})
}
