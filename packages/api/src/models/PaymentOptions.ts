/* eslint-disable @typescript-eslint/camelcase */
import { ErrorResponse, isOnlinePaymentErrorResponse, transformOnlinePaymentsErrorResponse } from './Error'

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

export function transformPaymentOptionsResponse(
	data: string,
	headers: Array<string>,
	status: string
): PaymentOptions | ErrorResponse {
	const response = JSON.parse(data)

	if (isOnlinePaymentErrorResponse(status, response)) {
		return transformOnlinePaymentsErrorResponse(status, response)
	}

	const paymentOptions: PaymentOptionsResponse = response['payment_options']

	return transformPaymentOptionsParsedResponse(paymentOptions)
}

function transformPaymentOptionsParsedResponse(options: any): PaymentOptions {
	return {
		gatewayName: options.gateway_name,
		hasCreditCard: options.has_credit_card,
		hasAchTransfer: options.has_ach_transfer,
		hasBacsDebit: options.has_bacs_debit,
		hasSepaDebit: options.has_sepa_debit,
		hasPayPalSmartCheckout: options.has_paypal_smart_checkout,
		allowPartialPayments: options.allow_partial_payments,
		entityId: options.entity_id,
		entityType: options.entity_type,
	}
}

export function transformPaymentOptionsRequest(options: PaymentOptions) {
	return JSON.stringify({
		gateway_name: options.gatewayName,
		entity_type: options.entityType,
		entity_id: options.entityId,
		allow_partial_payments: options.allowPartialPayments,
		has_paypal_smart_checkout: options.hasPayPalSmartCheckout,
		has_sepa_debit: options.hasSepaDebit,
		has_bacs_debit: options.hasBacsDebit,
		has_ach_transfer: options.hasAchTransfer,
		has_credit_card: options.hasCreditCard,
	})
}
