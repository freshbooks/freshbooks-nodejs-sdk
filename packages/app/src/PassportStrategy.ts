import OAuth2Strategy from 'passport-oauth2'

export const AUTHORIZATION_URL =
	'https://my.freshbooks.com/service/auth/oauth/authorize'
export const TOKEN_URL = 'https://api.freshbooks.com/auth/oauth/token'

export interface SessionUser {
	id: string
}

export default class FreshbooksStrategy extends OAuth2Strategy {
	private readonly clientId: string

	private readonly clientSecret: string

	private readonly callbackURL: string

	constructor(
		clientId: string,
		clientSecret: string,
		callbackURL: string,
		verify: OAuth2Strategy.VerifyFunction
	) {
		super(
			{
				authorizationURL: AUTHORIZATION_URL,
				tokenURL: TOKEN_URL,
				clientID: clientId,
				clientSecret,
				callbackURL,
			},
			verify
		)

		this.clientId = clientId
		this.clientSecret = clientSecret
		this.callbackURL = callbackURL
	}
}
