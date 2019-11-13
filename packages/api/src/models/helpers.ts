/**
 * Removes all null keys from an object
 * @param obj object
 * @returns object with null keys removed
 */
// eslint-disable-next-line import/prefer-default-export
export const filterNullKeys = (obj: Record<string, any>): void => {
	// eslint-disable-next-line no-param-reassign
	Object.keys(obj).forEach(key => obj[key] == null && delete obj[key])
}
