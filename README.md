# FreshBooks NodeJS SDK

![](https://github.com/freshbooks/api-sdk/workflows/Node%20CI/badge.svg)

The FreshBooks NodeJS SDK is a collection of single-purpose packages designed to easily build FreshBooks apps. Each package delivers part of the FreshBooks [REST API](https://www.freshbooks.com/api), so that you can choose the packages that fit your needs.

| Package              | What it's for |
| ---------------------|---------------|
| `@freshbooks/api`    | Get/set data from FreshBooks using the REST API.
| `@freshbooks/events` | Register/listen for incoming events via webhooks.
| `@freshbooks/app`    | Pre-configured [ExpressJS](https://expressjs.com/) app. Includes authentication via [PassportJS](http://www.passportjs.org/).

## Installation

Use your favorite package manager to install any of the packages and save to your `package.json`:

```shell
$ npm install @freshbooks/api @freshbooks/events @freshbooks/app

# Or, if you prefer yarn
$ yarn add @freshbooks/api @freshbooks/events @freshbooks/app
```

## Usage

### `@freshbooks/api`

Your app will interact with the REST API using the `Client` object, available from the `@freshbooks/api` package.
The client is instantiated with a valid OAuth token, which is used throughout the lifetime of the client to make API calls.

#### Configuring the API client

```typescript
import { Client } from '@freshbooks/api'

// Get token from authentication or configuration
const token = process.env.FRESHBOOKS_TOKEN

// Instantiate new FreshBooks API client
const client = new Client(token)
```

#### `users`

The `users` namespace provides access to the current user identity model.

```typescript
try {
  // Get the current user
  const { data } = await client.users.me()
  
  console.log(`Hello, ${data.id}`)
} catch ({ code, message }) {
  // Handle error if API call failed
  console.error(`Error fetching user: ${code} - ${message}`)
}
```
