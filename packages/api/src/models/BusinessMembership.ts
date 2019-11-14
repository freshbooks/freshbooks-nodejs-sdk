import Business from './Business'
import { transformBusinessResponse } from './Business'

export default interface BusinessMembership {
	id: string
	role: string
	business: Business
}

/**
 * Parse a JSON string to @BusinessMembership object
 * @param json JSON string
 * eg: '{
 * 			"id": 168372,
 * 			"role": "owner",
 * 			"business": {
 *          	"id": 77128,
 *          	"name": "BillSpring",
 *          	"account_id": "zDmNq",
 *          	"address": {
 *              	"id": 74595,
 *              	"street": "123",
 *              	"city": "Toronto",
 *              	"province": "Ontario",
 *              	"country": "Canada",
 *              	"postal_code": "A1B2C3"
 *          	},
 *          	"phone_number": null,
 *          	"business_clients": [
 *           		{
 *              		"id": 22347,
 *              		"business_id": 77128,
 *              		"account_id": "Xr82w",
 *              		"userid": 74353,
 *              		"client_business": {
 *                  		"business_id": 77128
 *              		},
 *              		"account_business": {
 *                  		"account_business_id": 363103,
 *                  		"account_id": "Xr82w"
 *              		}
 *           		}
 *          	]
 * 			}
 *      }'
 * @returns BusinessMembership object
 */
export function transformBusinessMembershipJSON(
	json: string
): BusinessMembership {
	const { id, role, business } = JSON.parse(json)

	return {
		id: id.toString(),
		role,
		business: transformBusinessResponse(business),
	}
}

/**
 * Format a BusinessMembership response object
 * @param data BusinessMembership object
 * eg: {
 * 			"id": 168372,
 * 			"role": "owner",
 * 			"business": {
 *          	"id": 77128,
 *          	"name": "BillSpring",
 *          	"account_id": "zDmNq",
 *          	"address": {
 *              	"id": 74595,
 *              	"street": "123",
 *              	"city": "Toronto",
 *              	"province": "Ontario",
 *              	"country": "Canada",
 *              	"postal_code": "A1B2C3"
 *          	},
 *          	"phone_number": null,
 *          	"business_clients": [
 *           		{
 *              		"id": 22347,
 *              		"business_id": 77128,
 *              		"account_id": "Xr82w",
 *              		"userid": 74353,
 *              		"client_business": {
 *                  		"business_id": 77128
 *              		},
 *              		"account_business": {
 *                  		"account_business_id": 363103,
 *                  		"account_id": "Xr82w"
 *              		}
 *           		}
 *          	]
 * 			}
 *      }
 * @returns BusinessMembership object
 */
export function transformBusinessMembershipResponse(
	data: any
): BusinessMembership {
	const { id, role, business } = data
	return {
		id: id.toString(),
		role,
		business: transformBusinessResponse(business),
	}
}
