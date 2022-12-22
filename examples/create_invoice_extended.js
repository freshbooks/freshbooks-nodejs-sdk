const { Client } = require('@freshbooks/api')

const CLIENT_ID = '<your client id>'
const ACCESS_TOKEN = '<your access token>'
const ACCOUNT_ID = '<your account id>'
const DESTINATION_EMAIL = '<your email>' // Don't use the same email as the account owner.

const fbClient = new Client(CLIENT_ID, { accessToken: ACCESS_TOKEN })

async function createClient() {
	console.log('Creating client...')

	try {
		const clientData = {
			email: DESTINATION_EMAIL,
			organization: 'NodeJS SDK Test Client',
		}
		const client = await fbClient.clients.create(clientData, ACCOUNT_ID)

		console.log(`Created client ${client.data.id}`)
		return client.data.id
	} catch (e) {
		console.log(e)
	}
}

async function createInvoice(clientId) {
	// Taxed line items
	line1 = {
		name: 'A Taxed Item',
		description: 'These things are taxed',
		qty: 2,
		taxAmount1: '13',
		taxName1: 'HST',
		unitCost: {
			amount: '27.00',
			code: 'CAD',
		},
	}

	line2 = {
		name: 'Another Taxed ItemRegular Glasses',
		description: 'With a different tax',
		qty: 4,
		taxAmount1: '5',
		taxName1: 'GST',
		unitCost: {
			amount: '6.95',
			code: 'CAD',
		},
	}

	invoiceData = {
		customerId: clientId,
		createDate: new Date(),
		lines: [line1, line2],
	}

	try {
		const invoice = await fbClient.invoices.create(invoiceData, ACCOUNT_ID)

		console.log(`Created invoice ${invoice.data.id}`)
		console.log(`Invoice total is ${invoice.data.amount.amount} ${invoice.data.amount.code}`)
		return invoice.data
	} catch (e) {
		console.log(e)
	}
}

async function sendInvoice(invoice) {
	console.log('Sending the invoice by email...')
	invoice.actionEmail = true
	invoice.emailRecipients = [DESTINATION_EMAIL]
	invoice.emailIncludePdf = false
	invoice.invoiceCustomizedEmail = {
		subject: 'Thanks for being a customer',
		body: 'This can be any personal message',
	}

	try {
		return await fbClient.invoices.update(ACCOUNT_ID, invoice.id, invoice)
	} catch (e) {
		console.log(e)
	}
}

async function main() {
	const clientId = await createClient()
	let invoice = await createInvoice(clientId)
	// Invoices are created in draft status until sent (or marked as sent)
	invoice = await sendInvoice(invoice)
}

main()
