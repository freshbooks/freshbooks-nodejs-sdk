/* eslint-disable @typescript-eslint/camelcase */
import { isAccountingErrorResponse, transformErrorResponse, ErrorResponse } from './Error'
import VisState from './VisState'
import Pagination from './Pagination'
import { Nullable } from './helpers'
import TasksRate, { transformTasksRateRequest } from './TasksRate'

export default interface Tasks {
	id?: number
	billable?: boolean
	description?: Nullable<string>
	name?: Nullable<string>
	rate?: TasksRate
	taskid?: number
	tname?: Nullable<string>
	tdesc?: Nullable<string>
	visState?: VisState
	updated?: Date
}

export function transformTasksData(task: any): Tasks {
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

export function transformTasksResponse(data: any): Tasks | ErrorResponse {
	const response = JSON.parse(data)
	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const {
		response: { result },
	} = response
	const { task } = result
	return transformTasksData(task)
}
/**
 * Parses JSON list response and converts to internal tasks list response
 * @param data representing JSON response
 * @returns tasks list response
 */
export function transformTasksListResponse(data: string): { tasks: Tasks[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}
	const {
		response: { result },
	} = response
	const { tasks, per_page, total, page, pages } = result
	return {
		pages: {
			page,
			pages,
			size: per_page,
			total,
		},
		tasks: tasks.map((task: Tasks) => transformTasksData(task)),
	}
}

export function transformTasksRequest(task: Tasks): string {
	return JSON.stringify({
		task: {
			id: task.id,
			billable: task.billable,
			description: task.description,
			name: task.name,
			rate: task.rate && transformTasksRateRequest(task.rate),
			taskid: task.taskid,
			tname: task.tname,
			tdesc: task.tdesc,
			visState: task.visState,
			updated: task.updated,
		},
	})
}
