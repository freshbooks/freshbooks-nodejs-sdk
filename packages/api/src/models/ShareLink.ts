/* eslint-disable @typescript-eslint/camelcase */
import { transformErrorResponse, isAccountingErrorResponse, ErrorResponse } from './Error'

export default interface ShareLink {
	resourceId: number
	clientId: number
	resourceType: string
	shareLink: string
	shareMethod: string
}

function transformShareLinkData({
	resourceid: resourceId,
	clientid: clientId,
	resource_type: resourceType,
	share_link: shareLink,
	share_method: shareMethod,
}: any): ShareLink {
	return {
		resourceId,
		clientId,
		resourceType,
		shareLink,
		shareMethod,
	}
}

export function transformShareLinkResponse(data: string): ShareLink | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { share_link } = response.response.result

	return transformShareLinkData(share_link)
}
