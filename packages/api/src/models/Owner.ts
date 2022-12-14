/* eslint-disable @typescript-eslint/camelcase */
export default interface Owner {
	email: string
	fName: string
	lName: string
	organization: string
	userId: string
}

export function transformOwnerParsedResponse(owner: any): Owner {
	return {
		userId: owner.userid,
		email: owner.email,
		fName: owner.fname,
		lName: owner.lname,
		organization: owner.organization,
	}
}
