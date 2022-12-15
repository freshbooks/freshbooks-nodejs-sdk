/* eslint-disable @typescript-eslint/camelcase */
import { transformErrorResponse, isAccountingErrorResponse, ErrorResponse } from './Error'

export default interface ShareLink {
	resourceId: number
	clientId: number
	resourceType: string
	shareLink: string
	shareMethod: string
}

export function transformShareLinkResponse(data: string): ShareLink | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { share_link } = response.response.result

	return transformShareLinkData(share_link)
}

function transformShareLinkData(link: any): ShareLink {
	return {
		resourceId: link.resourceid,
		clientId: link.client_id,
		resourceType: link.resource_type,
		shareLink: link.share_link,
		shareMethod: link.share_method,
	}
}
