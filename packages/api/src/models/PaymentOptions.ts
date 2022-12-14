/* eslint-disable @typescript-eslint/camelcase */
import { ErrorResponse, isProjectErrorResponse, transformErrorResponse } from './Error'

export enum PaymentGatewayName {
	WePay = 'fbpay',
	Stripe = 'stripe',
	PayPal = 'paypal',
}

export default interface PaymentOptions {
	gatewayName: PaymentGatewayName
	entityId: string
	entityType: string
	hasCreditCard?: boolean
	hasAchTransfer?: boolean
	hasBacsDebit?: boolean
	hasSepaDebit?: boolean
	hasPayPalSmartCheckout?: boolean
	allowPartialPayments?: boolean
}

type PaymentOptionsResponse = Required<PaymentOptions>

export function transformPaymentOptionsResponse(data: string): PaymentOptions | ErrorResponse {
	const response = JSON.parse(data)

	if (isProjectErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const paymentOptions: PaymentOptionsResponse = response['payment_options']

	return transformPaymentOptionsData(paymentOptions)
}

function transformPaymentOptionsData(paymentOptions: any): PaymentOptions {
	return {
		gatewayName: paymentOptions.gateway_name,
		hasCreditCard: paymentOptions.has_credit_card,
		hasAchTransfer: paymentOptions.has_ach_transfer,
		hasBacsDebit: paymentOptions.has_bacs_debit,
		hasSepaDebit: paymentOptions.has_sepa_debit,
		hasPayPalSmartCheckout: paymentOptions.has_paypal_smart_checkout,
		allowPartialPayments: paymentOptions.allow_partial_payments,
		entityId: paymentOptions.entity_id,
		entityType: paymentOptions.entity_type,
	}
}

export function transformPaymentOptionsRequest({
	gatewayName: gateway_name,
	hasCreditCard: has_credit_card,
	hasAchTransfer: has_ach_transfer,
	hasBacsDebit: has_bacs_debit,
	hasSepaDebit: has_sepa_debit,
	hasPayPalSmartCheckout: has_paypal_smart_checkout,
	allowPartialPayments: allow_partial_payments,
	entityId: entity_id,
	entityType: entity_type,
}: PaymentOptions) {
	return JSON.stringify({
		gateway_name,
		entity_type,
		entity_id,
		allow_partial_payments,
		has_paypal_smart_checkout,
		has_sepa_debit,
		has_bacs_debit,
		has_ach_transfer,
		has_credit_card,
	})
}
