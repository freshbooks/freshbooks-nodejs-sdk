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
		timeEntries: time_entries.map((time_entry: TimeEntry) => transformTimeEntryParsedResponse(time_entry)),
		pages: {
			total,
			size: per_page,
			pages,
			page,
		},	
	}
}

function transformTimeEntryParsedResponse(timeEntry: any): TimeEntry {
	return {
		id: timeEntry.id,
		identityId: timeEntry.identity_id,
		isLogged: timeEntry.is_logged,
		startedAt: transformDateResponse(timeEntry.started_at, DateFormat['YYYY-MM-DDThh:mm:ss']),
		createdAt: transformDateResponse(timeEntry.created_at, DateFormat['YYYY-MM-DDThh:mm:ss']),
		clientId: timeEntry.client_id,
		projectId: timeEntry.project_id,
		pendingClient: timeEntry.pending_client,
		pendingProject: timeEntry.pending_project,
		pendingTask: timeEntry.pending_task,
		taskId: timeEntry.task_id,
		serviceId: timeEntry.service_id,
		note: timeEntry.note,
		active: timeEntry.active,
		billable: timeEntry.billable,
		billed: timeEntry.billed,
		internal: timeEntry.internal,
		retainerId: timeEntry.retainer_id,
		duration: timeEntry.duration,
		timer: timeEntry.timer && transformTimerParsedResponse(timeEntry.timer),
	}
}

export function transformTimeEntryRequest(timeEntry: TimeEntry): string {
	return JSON.stringify({
		time_entry: {
			id: timeEntry.id,
			identity_id: timeEntry.identityId,
			is_logged: timeEntry.isLogged,
			started_at: timeEntry.startedAt ? timeEntry.startedAt.toISOString() : null,
			client_id: timeEntry.clientId,
			project_id: timeEntry.projectId,
			pending_client: timeEntry.pendingClient,
			pending_project: timeEntry.pendingProject,
			pending_task: timeEntry.pendingTask,
			task_id: timeEntry.taskId,
			service_id: timeEntry.serviceId,
			note: timeEntry.note,
			active: timeEntry.active,
			billable: timeEntry.billable,
			billed: timeEntry.billed,
			internal: timeEntry.internal,
			retainer_id: timeEntry.retainerId,
			duration: timeEntry.duration,
		},
	})
}
