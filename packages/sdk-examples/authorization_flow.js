// This is an example where we run through the OAuth flow,
// select a business, and display a client from that business.
import pkg from '@freshbooks/api';
const { Client } = pkg;

import * as readline from 'node:readline';
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

const FB_CLIENT_ID = '<your client id>'
const FB_CLIENT_SECRET = '<your client secret>'
const REDIRECT_URI = '<your redirect uri>'

const fbClient = new Client(FB_CLIENT_ID, {
	clientSecret: FB_CLIENT_SECRET,
	redirectUri: REDIRECT_URI,
})

async function authorizeFbClient() {
	const authorizationUrl = fbClient.getAuthRequestUrl(['user:profile:read', 'user:clients:read'])
	console.log(`Go to this URL to authorize: ${authorizationUrl}`)

	// Going to that URL will prompt the user to log into FreshBooks and authorize the application.
	// Once authorized, FreshBooks will redirect the user to your `redirect_uri` with the authorization
	// code will be a parameter in the URL.
	const authCode = await new Promise((resolve) => {
		rl.question('Enter the code you get after authorization: ', resolve)
	})

	// This will exchange the authorization code for an access token
	const tokenData = await fbClient.getAccessToken(authCode)
	console.log(tokenData)
	console.log(`This is the access token the client is now configurated with: ${tokenData.accessToken}`)
	console.log(`It is good until ${tokenData.accessTokenExpiresAt}\n`)
	return tokenData
}

async function getAccountAndBusinessIds() {
	// Get the current user's identity
	const identity = await fbClient.users.me()

	if (identity.ok === true) {
		// Display all of the businesses the user has access to
		const businesses = []
		const index = 1
		identity.data.businessMemberships.forEach((businessMembership) => {
			const business = businessMembership.business
			businesses.push({ name: business.name, businessId: business.id, accountId: business.accountId })
			console.log(`${index}: ${business.name}`)
		})

		const businessIndex = await new Promise((resolve) => {
			rl.question('Which business do you want to use? ', resolve)
		})
		rl.close()

		return businesses[businessIndex - 1]
	}
}

async function getClient(business) {
	// Get a client for the business to show successful access
	const clients = await fbClient.clients.list(business.accountId)
	if (clients.ok === true) {
		const client = clients.data.clients[0]
		console.log(`'${client.organization}' is a client of ${business.name}`)
	}
	return
}

async function main() {
	await authorizeFbClient()
	const business = await getAccountAndBusinessIds()
	await getClient(business)
}

main()
