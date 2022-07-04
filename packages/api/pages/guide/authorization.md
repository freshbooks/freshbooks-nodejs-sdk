
# Authorization Flow

_This is a brief summary of the OAuth2 authorization flow and the methods in the FreshBooks API Client
around them. See the [FreshBooks API - Authentication](https://www.freshbooks.com/api/authentication) documentation._

First, instantiate your Client with `clientId`, `clientSecret`, and `redirectUri` as above.

To get an access token, the user must first authorize your application. This can be done by sending the user to
the FreshBooks authorization page. Once the user has clicked accept there, they will be redirected to your
`redirectUri` with an access grant code. The authorization URL can be obtained by calling
`fbClient.getAuthRequestUrl()`. This method also accepts a list of scopes that you wish the user to
authorize your application for.

```typescript
const authorizationUrl = fbClient.getAuthRequestUrl(['user:profile:read', 'user:clients:read'])
```

Once the user has been redirected to your `redirectUri` and you have obtained the access grant code, you can exchange
that code for a valid access token.

```typescript
const tokenData = await fbClient.getAccessToken(accessGrantCode)
```

This call both sets the `accessToken`, `refreshToken`, and `accessTokenExpiresAt` fields on you Client instance,
and returns those values.

```typescript
console.log(`This is the access token the client is now configurated with: ${tokenData.accessToken}`)
console.log(`It is good until ${tokenData.accessTokenExpiresAt}\n`)
console.log(`And can be refreshed once expired with: ${tokenData.refreshToken}`)
```

When the token expires, it can be refreshed with the `refreshToken` value in the Client:

```typescript
const refreshedTokenData = fbClient.refreshAccessToken()
console.log(`The new access token the client configurated with after the refresh: ${refreshedTokenData.accessToken}`)
```

or you can pass the refresh token yourself:

```typescript
const refreshedTokenData = fbClient.refreshAccessToken(storedRefreshToken)
```
