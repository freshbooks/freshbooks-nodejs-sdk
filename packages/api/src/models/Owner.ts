/* eslint-disable @typescript-eslint/camelcase */
export default interface Owner {
	email: string
	fName: string
	lName: string
	organization: string
	userId: string
}

export function transformOwnerResponse(owner: any): Owner {
	return {
		userId: owner.userid,
		email: owner.email,
		fName: owner.fname,
		lName: owner.lname,
		organization: owner.organization,
	}
}

/**
 * Parse a JSON string to @Owner object
 * @param json JSON string
 * eg: `{
 *         "email": "bhaskar@secretmission.io",
 *         "fname": "Johnny",
 *         "lname": "Appleseed",
 *         "organization": "",
 *         "userid": 1
 *      }`
 * @returns Owner object
 */
export function transformOwnerJSON(json: string): Owner {
	const response = JSON.parse(json)
	return transformOwnerResponse(response)
}
