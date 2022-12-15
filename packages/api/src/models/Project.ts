/* eslint-disable @typescript-eslint/camelcase */
import { ErrorResponse, isProjectErrorResponse, transformErrorResponse } from './Error'
import Pagination from './Pagination'
import { Nullable } from './helpers'
import { transformDateResponse, DateFormat } from './Date'
import ProjectGroup, { transformProjectGroupResponse } from './ProjectGroup'
import Service, { transformServiceData } from './Service'

export enum ProjectType {
	FixedPrice = 'fixed_price',
	HourlyRate = 'hourly_rate',
}

export enum BillingMethod {
	BusinessRate = 'business_rate',
	ProjectRate = 'project_rate',
	ServiceRate = 'service_rate',
	TeamMemberRate = 'team_member_rate',
}

export enum BilledStatus {
	Billed = 'billed',
	PartiallyBilled = 'partially_billed',
	Unbilled = 'unbilled',
}

export default interface Project {
	id?: number
	title?: string
	description?: Nullable<string>
	dueDate?: Nullable<Date>
	clientId?: Nullable<string>
	internal?: boolean
	budget?: Nullable<string>
	fixedPrice?: Nullable<string>
	rate?: Nullable<string>
	billingMethod?: Nullable<BillingMethod>
	projectType?: ProjectType
	projectManagerId?: Nullable<string>
	active?: boolean
	complete?: boolean
	sample?: boolean
	createdAt?: Date
	updatedAt?: Date
	loggedDuration?: Nullable<number>
	services?: Nullable<Service[]>
	billedAmount?: number
	billedStatus?: BilledStatus
	retainerId?: Nullable<string>
	expenseMarkup?: number
	groupId?: Nullable<string>
	group?: Nullable<ProjectGroup>
}

function transformProjectData(project: any): Project {
	return {
		id: project.id,
		title: project.title,
		description: project.description,
		dueDate: project.due_date && transformDateResponse(project.due_date, DateFormat['YYYY-MM-DD']),
		clientId: project.client_id,
		internal: project.internal,
		budget: project.budget,
		fixedPrice: project.fixed_price,
		rate: project.rate,
		billingMethod: project.billing_method,
		projectType: project.project_type,
		projectManagerId: project.project_manager_id,
		active: project.active,
		complete: project.complete,
		sample: project.sample,
		createdAt: transformDateResponse(project.created_at, DateFormat['YYYY-MM-DDThh:mm:ss']),
		updatedAt: transformDateResponse(project.updated_at, DateFormat['YYYY-MM-DDThh:mm:ss']),
		loggedDuration: project.logged_duration,
		services: project.services && project.services.map(transformServiceData),
		billedAmount: project.billed_amount,
		billedStatus: project.billed_status,
		retainerId: project.retainer_id,
		expenseMarkup: project.expense_markup,
		groupId: project.group_id,
		group: project.group && transformProjectGroupResponse(project.group),
	}
}

export function transformProjectResponse(data: string): Project | ErrorResponse {
	const response = JSON.parse(data)

	if (isProjectErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { project } = response

	return transformProjectData(project)
}


export function transformProjectListResponse(data: string): { projects: Project[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isProjectErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { projects, meta } = response
	const { total, per_page, page, pages } = meta

	return {
		projects: projects.map((project: Project) => transformProjectData(project)),
		pages: {
			total,
			size: per_page,
			pages,
			page,
		},
	}
}

/**
 * Converts @Project object into JSON string
 *
 * @param project @Project object
 * @returns JSON string representing Project request
 */
export function transformProjectRequest(project: Project): string {
	const model = {
		project: {
			id: project.id,
			title: project.title,
			description: project.description,
			due_date: project.dueDate,
			client_id: project.clientId,
			internal: project.internal,
			budget: project.budget,
			fixed_price: project.fixedPrice,
			rate: project.rate,
			billing_method: project.billingMethod,
			project_type: project.projectType,
			project_manager_id: project.projectManagerId,
			active: project.active,
			complete: project.complete,
			sample: project.sample,
			logged_duration: project.loggedDuration,
			billed_amount: project.billedAmount,
			billed_status: project.billedStatus,
			retainer_id: project.retainerId,
			expense_markup: project.expenseMarkup,
		},
	}
	return JSON.stringify(model)
}
