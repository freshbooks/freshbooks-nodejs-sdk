/* eslint-disable @typescript-eslint/camelcase */
import { ErrorResponse, isProjectErrorResponse, transformErrorResponse } from './Error'
import Pagination from './Pagination'
import { Nullable } from './helpers'
import { transformDateResponse, DateFormat } from './Date'
import Timer, { transformTimerParsedResponse } from './Timer'

export default interface TimeEntry {
	id?: number
	identityId?: number
	isLogged: boolean
	startedAt: Date
	createdAt?: Date
	clientId?: number
	projectId?: number
	pendingClient?: Nullable<string>
	pendingProject?: Nullable<string>
	pendingTask?: Nullable<string>
	taskId?: Nullable<number>
	serviceId?: Nullable<number>
	note?: Nullable<string>
	active?: boolean
	billable?: boolean
	billed?: boolean
	internal?: boolean
	retainerId?: Nullable<number>
	duration: number
	timer?: Nullable<Timer>
}

export function transformTimeEntryResponse(data: string): TimeEntry | ErrorResponse {
	const response = JSON.parse(data)

	if (isProjectErrorResponse(response)) {
		return transformErrorResponse(response)
	}
	const { time_entry } = response

	return transformTimeEntryParsedResponse(time_entry)
}

export function transformTimeEntryListResponse(data: string): { timeEntries: TimeEntry[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isProjectErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { time_entries, meta } = response
	const { total, per_page, page, pages } = meta

	return {
		timeEntries: time_entries.map((entry: any): TimeEntry => transformTimeEntryParsedResponse(entry)),
		pages: {
			total,
			size: per_page,
			pages,
			page,
		},	
	}
}

function transformTimeEntryParsedResponse(entry: any): TimeEntry {
	return {
		id: entry.id,
		identityId: entry.identity_id,
		isLogged: entry.is_logged,
		startedAt: transformDateResponse(entry.started_at, DateFormat['YYYY-MM-DDThh:mm:ss']),
		createdAt: transformDateResponse(entry.created_at, DateFormat['YYYY-MM-DDThh:mm:ss']),
		clientId: entry.client_id,
		projectId: entry.project_id,
		pendingClient: entry.pending_client,
		pendingProject: entry.pending_project,
		pendingTask: entry.pending_task,
		taskId: entry.task_id,
		serviceId: entry.service_id,
		note: entry.note,
		active: entry.active,
		billable: entry.billable,
		billed: entry.billed,
		internal: entry.internal,
		retainerId: entry.retainer_id,
		duration: entry.duration,
		timer: entry.timer && transformTimerParsedResponse(entry.timer),
	}
}

export function transformTimeEntryRequest(entry: TimeEntry): string {
	return JSON.stringify({
		time_entry: {
			id: entry.id,
			identity_id: entry.identityId,
			is_logged: entry.isLogged,
			started_at: entry.startedAt ? entry.startedAt.toISOString() : null,
			client_id: entry.clientId,
			project_id: entry.projectId,
			pending_client: entry.pendingClient,
			pending_project: entry.pendingProject,
			pending_task: entry.pendingTask,
			task_id: entry.taskId,
			service_id: entry.serviceId,
			note: entry.note,
			active: entry.active,
			billable: entry.billable,
			billed: entry.billed,
			internal: entry.internal,
			retainer_id: entry.retainerId,
			duration: entry.duration,
		},
	})
}
