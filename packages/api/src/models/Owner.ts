/* eslint-disable @typescript-eslint/camelcase */
export default interface Owner {
	email: string
	fName: string
	lName: string
	organization: string
	userId: string
}

/**
 * Format an Owner response object
 * @param data Owner object
 * eg: {
 *         email: "bhaskar@secretmission.io",
 *         fname: "Johnny",
 *         lname: "Appleseed",
 *         organization: "",
 *         userid: 1
 *       }
 * @returns Owner object
 */
export function transformOwnerResponse({
	userid: userId,
	email,
	fname: fName,
	lname: lName,
	organization,
}: any): Owner {
	return {
		userId,
		email,
		fName,
		lName,
		organization,
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
