/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import APIClient, { Options } from '../src/APIClient'
import APIClientError from '../src/models/Error'
import { PaymentGatewayName, transformPaymentOptionsRequest } from '../src/models/PaymentOptions'

const mock = new MockAdapter(axios) // set mock adapter on default axios instance

const ACCOUNT_ID = 'zDmNq'
const INVOICE_ID = '6463'
const APPLICATION_CLIENT_ID = 'test-client-id'
const testOptions: Options = { accessToken: 'token' }

function makePaymentOptions(gatewayName: PaymentGatewayName, camel = false) {
	if (camel) {
		return {
			gatewayName: gatewayName,
			hasCreditCard: true,
			hasAchTransfer: false,
			hasBacsDebit: false,
			hasSepaDebit: false,
			hasPayPalSmartCheckout: false,
			allowPartialPayments: false,
			entityId: INVOICE_ID,
			entityType: 'invoice',
		}
	}
	return {
		gateway_name: gatewayName,
		has_credit_card: true,
		has_ach_transfer: false,
		has_bacs_debit: false,
		has_sepa_debit: false,
		has_paypal_smart_checkout: false,
		allow_partial_payments: false,
		entity_id: INVOICE_ID,
		entity_type: 'invoice',
	}
}

describe('@freshbooks/api', () => {
	describe('Payment Options', () => {
		test('payment options for an invoice', async () => {
			const client = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			mock.onGet(`/payments/account/${ACCOUNT_ID}/invoice/${INVOICE_ID}/payment_options`).replyOnce(
				200,
				JSON.stringify({
					payment_options: makePaymentOptions(PaymentGatewayName.PayPal),
				})
			)

			const { data } = await client.paymentOptions.single(ACCOUNT_ID, INVOICE_ID)
			expect(data).toMatchObject(makePaymentOptions(PaymentGatewayName.PayPal, true))
		})

		test('payment options for an invoice - error ', async () => {
			const client = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			mock.onGet(`/payments/account/${ACCOUNT_ID}/invoice/${INVOICE_ID}/payment_options`).replyOnce(
				400,
				JSON.stringify({
					error_type: 'invalid_cc_type',
					message: 'Invalid CC type',
				})
			)
			try {
				await client.paymentOptions.single(ACCOUNT_ID, INVOICE_ID)
			} catch (err: any) {
				expect(err).toBeInstanceOf(APIClientError)
				expect(err.message).toEqual('The requested resource was not found.')
			}
		})

		test('default payment options for an account', async () => {
			const client = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			mock.onGet(`/payments/account/${ACCOUNT_ID}/payment_options?entity_type=invoice`).replyOnce(
				200,
				JSON.stringify({
					payment_options: makePaymentOptions(PaymentGatewayName.Stripe),
				})
			)

			const { data } = await client.paymentOptions.default(ACCOUNT_ID)
			expect(data).toMatchObject(makePaymentOptions(PaymentGatewayName.Stripe, true))
		})

		test('default payment options for an account - error', async () => {
			const client = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			mock.onGet(`/payments/account/${ACCOUNT_ID}/payment_options?entity_type=invoice`).replyOnce(
				400,
				JSON.stringify({
					error_type: 'invalid_cc_type',
					message: 'Invalid CC type',
				})
			)
			try {
				await client.paymentOptions.default(ACCOUNT_ID)
			} catch (err: any) {
				expect(err).toBeInstanceOf(APIClientError)
				expect(err.message).toEqual('The requested resource was not found.')
			}
		})

		test('add payment options to an invoice', async () => {
			const client = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			mock.onPost(`/payments/account/${ACCOUNT_ID}/invoice/${INVOICE_ID}/payment_options`).replyOnce(
				200,
				JSON.stringify({
					payment_options: makePaymentOptions(PaymentGatewayName.WePay),
				})
			)

			const { data } = await client.paymentOptions.create(ACCOUNT_ID, INVOICE_ID, {
				gatewayName: PaymentGatewayName.WePay,
				hasCreditCard: true,
				entityId: INVOICE_ID,
				entityType: 'invoice',
			})
			expect(data).toMatchObject(makePaymentOptions(PaymentGatewayName.WePay, true))
		})

		test('add payment options to an invoice - error', async () => {
			const client = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			mock.onPost(`/payments/account/${ACCOUNT_ID}/invoice/${INVOICE_ID}/payment_options`).replyOnce(
				400,
				JSON.stringify({
					error_type: 'invalid_cc_type',
					message: 'Invalid CC type',
				})
			)

			try {
				await client.paymentOptions.create(ACCOUNT_ID, INVOICE_ID, {
					gatewayName: PaymentGatewayName.WePay,
					hasCreditCard: true,
					entityId: INVOICE_ID,
					entityType: 'invoice',
				})
			} catch (err: any) {
				expect(err).toBeInstanceOf(APIClientError)
				expect(err.message).toEqual('The requested resource was not found.')
			}
		})
	})
})
