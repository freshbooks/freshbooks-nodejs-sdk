const { Client } = require('@freshbooks/api')

const CLIENT_ID = '<your client id>'
const ACCESS_TOKEN = '<your access token>'
const ACCOUNT_ID = '<your account id>'

const fbClient = new Client(CLIENT_ID, { accessToken: ACCESS_TOKEN })

async function createClient() {
	console.log('Creating client...')

	try {
		const clientData = { organization: 'NodeJS SDK Test Client' }
		const client = await fbClient.clients.create(clientData, ACCOUNT_ID)

		console.log(`Created client ${client.data.id}`)
		return client.data.id
	} catch (e) {
		console.log(e)
	}
}

async function createInvoice(clientId) {
	const line1 = {
		name: 'Fancy Dishes',
		description: "They're pretty swanky",
		qty: 6,
		unitCost: {
			amount: '27.00',
			code: 'CAD',
		},
	}
	const line2 = {
		name: 'Regular Glasses',
		description: 'They look "just ok"',
		qty: 8,
		unitCost: {
			amount: '5.95',
			code: 'CAD',
		},
	}
	const invoiceData = {
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

async function markInvoiceSent(invoice) {
	console.log('Marking invoice as sent...')
	invoice.actionMarkAsSent = true

	try {
		return await fbClient.invoices.update(ACCOUNT_ID, invoice.id, invoice)
	} catch (e) {
		console.log(e)
	}
}

async function main() {
	const clientId = await createClient()
	let invoice = await createInvoice(clientId)
	// Invoices are created in draft status, so we need to mark it as sent
	invoice = await markInvoiceSent(invoice)
}

main()
