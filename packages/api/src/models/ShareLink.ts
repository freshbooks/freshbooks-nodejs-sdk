/* eslint-disable @typescript-eslint/camelcase */
import { transformAccountingErrorResponse, isAccountingErrorResponse, ErrorResponse } from './Error'

export default interface ShareLink {
	resourceId: number
	clientId: number
	resourceType: string
	shareLink: string
	shareMethod: string
}

function transformShareLinkParsedResponse(link: any): ShareLink {
	return {
		resourceId: link.resourceid,
		clientId: link.clientid,
		resourceType: link.resource_type,
		shareLink: link.share_link,
		shareMethod: link.share_method,
	}
}

export function transformShareLinkResponse(
	data: string,
	headers: Array<string>,
	status: string
): ShareLink | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(status, response)) {
		return transformAccountingErrorResponse(response)
	}

	const { share_link } = response.response.result

	return transformShareLinkParsedResponse(share_link)
}
