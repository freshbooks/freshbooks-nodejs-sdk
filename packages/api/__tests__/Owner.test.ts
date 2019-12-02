/* eslint-disable @typescript-eslint/camelcase */
import { transformOwnerJSON, transformOwnerResponse } from '../src/models/Owner'

describe('@freshbooks/api', () => {
	describe('Group', () => {
		test('Verify JSON -> model transform', () => {
			const json = `
            {
                "email": "bhaskar@secretmission.io",
                "fname": "Johnny",
                "lname": "Appleseed",
                "organization": "",
                "userid": 1
            }
            `
			const model = transformOwnerJSON(json)
			const expected = {
				email: 'bhaskar@secretmission.io',
				fName: 'Johnny',
				lName: 'Appleseed',
				organization: '',
				userId: 1,
			}
			expect(model).toEqual(expected)
		})
		test('Verify parsed JSON -> model transform', () => {
			const data = {
				email: 'bhaskar@secretmission.io',
				fname: 'Johnny',
				lname: 'Appleseed',
				organization: '',
				userid: 1,
			}
			const model = transformOwnerResponse(data)
			const expected = {
				email: 'bhaskar@secretmission.io',
				fName: 'Johnny',
				lName: 'Appleseed',
				organization: '',
				userId: 1,
			}
			expect(model).toEqual(expected)
		})
	})
})
