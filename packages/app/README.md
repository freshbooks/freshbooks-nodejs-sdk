# FreshBooks NodeJS SDK

![](https://github.com/freshbooks/api-sdk/workflows/Node%20CI/badge.svg)

The FreshBooks NodeJS SDK is a collection of single-purpose packages designed to easily build FreshBooks apps. Each package delivers part of the FreshBooks [REST API](https://www.freshbooks.com/api), so that you can choose the packages that fit your needs.

| Package                             | What it's for                                                                                                                 |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [`@freshbooks/api`](https://www.npmjs.com/package/@freshbooks/api) | Get/set data from FreshBooks using the REST API.                                                                              |
| [`@freshbooks/events`](https://www.npmjs.com/package/@freshbooks/events)                | Register/listen for incoming events via webhooks.                                                                             |
| [`@freshbooks/app`](https://www.npmjs.com/package/@freshbooks/api) | Pre-configured [ExpressJS](https://expressjs.com/) app. Includes authentication via [PassportJS](http://www.passportjs.org/). |

## Installation

Use your favorite package manager to install any of the packages and save to your `package.json`:

```shell
$ npm install @freshbooks/api @freshbooks/events @freshbooks/app

# Or, if you prefer yarn
$ yarn add @freshbooks/api @freshbooks/events @freshbooks/app
```

## Usage

### `@freshbooks/app`

The FreshBooks SDK provides a pre-configured `ExpressJS` app. This app provides OAuth2 authentication flow, a `PassportJS` middleware for authenticating requests, and session middleware to retrieve tokens for a session.

#### Using the ExpressJS app

Setting up the ExpressJS app requires a FreshBooks `client__id` and `client_secret`, as well as a callback URL to receive user authentication and refresh tokens. Once configured, routes can be configured as in any other `ExpressJS` app.

```typescript
import { Client } from '@freshbooks/api'
import createApp from '@freshbooks/app'

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const CALLBACK_URL = process.env.CALLBACK_URL

const app = createApp(CLIENT_ID, CLIENT_SECRET, CALLBACK)

// set up callback route
app.get('/auth/freshbooks/redirect', passport.authorize('freshbooks')

// set up an authenticated route
app.get('/settings', passport.authorize('freshbooks'), async (req, res) => {
  // get an API client
  const { token } = req.user
  const client = new Client(CLIENT_ID, token)

  // fetch the current user
  try {
    const { data } = await client.users.me()
    res.send(data.id)
  } catch ({ code, message }) {
    res.status(500, `Error - ${code}: ${message}`)
  }
})
```
