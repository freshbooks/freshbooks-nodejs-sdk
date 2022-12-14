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

	return transformPaymentOptionsParsedResponse(paymentOptions)
}

function transformPaymentOptionsParsedResponse(paymentOptions: any): PaymentOptions {
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

export function transformPaymentOptionsRequest(paymentOptions: PaymentOptions) {
	return JSON.stringify({
		gateway_name: paymentOptions.gatewayName,
		entity_type: paymentOptions.entityType,
		entity_id: paymentOptions.entityId,
		allow_partial_payments: paymentOptions.allowPartialPayments,
		has_paypal_smart_checkout: paymentOptions.hasPayPalSmartCheckout,
		has_sepa_debit: paymentOptions.hasSepaDebit,
		has_bacs_debit: paymentOptions.hasBacsDebit,
		has_ach_transfer: paymentOptions.hasAchTransfer,
		has_credit_card: paymentOptions.hasCreditCard,
	})
}
