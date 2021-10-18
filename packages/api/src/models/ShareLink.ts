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
	console.log('*************************')
	console.log(data)
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const {
		response: { result },
	} = response
	const { share_link } = result
	return transformShareLinkData(share_link)
}

