# Configuring The API Client

You can create an instance of the API client in one of two ways:

- By providing your application's OAuth2 `clientId` and `clientSecret` and following through the auth flow, which when
  complete will return an access token
- Or if you already have a valid access token, you can instantiate the client directly using that token, however token
  refresh flows will not function without the application id and secret.

## Using a client secret and redirect URI

```typescript
import { Client } from '@freshbooks/api'

const FB_CLIENT_ID = '<your client id>'
const FB_CLIENT_SECRET = '<your client secret>'
const REDIRECT_URI = '<your redirect uri>'

const fbClient = new Client(FB_CLIENT_ID, {
    clientSecret: FB_CLIENT_SECRET,
    redirectUri: REDIRECT_URI
})
```

and then proceed with the auth flow (see Authorization Flow).

## Using a pre-generated access token

```typescript
import { Client } from '@freshbooks/api'

const FB_CLIENT_ID = '<your client id>'
const PRE_EXISTING_TOKEN = '<a valid token>'

const fbClient = new Client(FB_CLIENT_ID, {
    accessToken=PRE_EXISTING_TOKEN
})
```
