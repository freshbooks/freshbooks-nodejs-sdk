# FreshBooks NodeJS SDK

[![npm](https://img.shields.io/npm/v/@freshbooks/api)](https://www.npmjs.com/package/@freshbooks/api)
![node-lts](https://img.shields.io/node/v-lts/@freshbooks/api)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/freshbooks/freshbooks-nodejs-sdk/Run%20Tests)](https://github.com/freshbooks/freshbooks-nodejs-sdk/actions?query=workflow%3A%22Run+Tests%22)

The FreshBooks NodeJS SDK allows you to more easily utilize the FreshBooks API.

## Installation

Use your favorite package manager to install any of the packages and save to your `package.json`:

```shell
$ npm install @freshbooks/api

# Or, if you prefer yarn
$ yarn add @freshbooks/api
```

## Usage

See the [full documentation](https://freshbooks.github.io/freshbooks-nodejs-sdk/).

### Configuring the API client

Your app will interact with the REST API using the `Client` object, available from the `@freshbooks/api` package.
The client may be instantiated with a valid OAuth token or provided with a client secret and redirect URI which may
then be used to obtain an access token.

#### Using a pre-generated access token

```typescript
import { Client } from '@freshbooks/api'

const clientId = process.env.FRESHBOOKS_APPLICATION_CLIENT_ID

// Get token from authentication or configuration
const token = process.env.FRESHBOOKS_TOKEN

// Instantiate new FreshBooks API client
const client = new Client(clientId, {
    accessToken: token,
})
```

#### Using a client secret and redirect URI

```typescript
import { Client } from '@freshbooks/api'

const clientId = process.env.FRESHBOOKS_APPLICATION_CLIENT_ID
const clientSecret = process.env.FRESHBOOKS_APPLICATION_CLIENT_SECRET

// Instantiate new FreshBooks API client
const client = new Client(clientId, {
    clientSecret,
    redirectUri: 'https://your-redirect-uri.com/'
})

// Give this URL to the user so they can authorize your application
const authUrl = client.getAuthRequestUrl()

// This will redirect them to https://your-redirect-uri.com/?code=XXX
const code = ...

// Returns an object containing the access token, refresh token, and expiry date
// Note that this function sets the token on this client instance to automatically
// authenticates all future requests with this client instance
const tokens = client.getAccessToken(code)
```

### Get/set data from REST API

All REST API methods return a response in the shape of:

```typescript
{
    ok: boolean
    data?: T // model type of result
    error?: Error
}
```

Example API client call:

```typescript
try {
    // Get the current user
    const { data } = await client.users.me()

    console.log(`Hello, ${data.id}`)
} catch ({ statusCode, message }) {
    // Handle error if API call failed
    console.error(`Error fetching user: ${statusCode} - ${message}`)
}
```

#### Errors

If an API error occurs, the response object contains an `error` object, with the following shape:

```typescript
{
    name: string        // Name of the method called
    message: string     // Error message
    statusCode?: string // HTTP Status Code
    errors?: APIError[] // More detailed message if available
}
```

Not all API calls return a list of specific errors, but if they do, they will be in the form of:

```typescript
{
    message: string    // Specific error message eg. 'Item not found.'
    errorCode?: number // A error code, if available. Eg. '1012'
    field?: string     // The field that caused the error, if available. Eg. `itemid`
    object?: string    // The resource, if available. Eg. `item`
    value?: string     // The value of the field, if available. Eg. `123432`
}
```

Examples:

```typescript
clientData = {}
try {
    const client = await fbClient.clients.single(accountId, 00000)
    console.log('Not called')
} catch (err) {
    console.log(err.name)
    console.log(err.message)
    console.log(err.statusCode)
    console.log(err.errors)
}
/*
Output:
Get Client
Client not found.
404
[
  {
    message: 'Client not found.',
    errorCode: 1012,
    field: 'userid',
    object: 'client',
    value: '00000'
  }
]
*/
```

```typescript
clientData = {}
try {
    const client = await fbClient.clients.create(clientData, accountId)
    console.log('Not called')
} catch (err) {
    console.log(err.name)
    console.log(err.message)
    console.log(err.statusCode)
    console.log(err.errors)
}
/*
Output:
Create Client
At least one field among fname, lname, email and organization is required.
422
[
  {
    message: 'At least one field among fname, lname, email and organization is required.',
    errorCode: 7012,
    field: null,
    object: 'client',
    value: ''
  }
]
*/
```

### Pagination, Filters, and Includes

If an endpoint supports searching or custom inclusions via query parameters, these parameters
can be specified using a `QueryBuilderType`. See [FreshBooks API - Parameters](https://www.freshbooks.com/api/parameters)
documentation.

```typescript
type QueryBuilderType = PaginationQueryBuilder | IncludesQueryBuilder | SearchQueryBuilder
```

An appropriate method on the API client will support an array of builders:

```typescript
public readonly invoices = {
    list: (accountId: string, queryBuilders?: QueryBuilderType[]) => Promise<Result<{
        invoices: Invoice[];
        pages: Pagination;
    }>>;
}
```

#### Pagination

Pagination results are included in `list` responses. The `data` object will contain a `pages` property, with the following:

```typescript
{
    page: number  // The current page of results
    pages: number // The number of pages of results
    total: number // The total number of results
    size: number  // The number of results per page
}
```

To make a paginated call, first create a `PaginationQueryBuilder` object set using the `page` and `perPage` functions
and pass it in the `list` call.

```typescript
import { PaginationQueryBuilder } from '@freshbooks/api/dist/models/builders/PaginationQueryBuilder'

const paginator = new PaginationQueryBuilder()
paginator.page(1).perPage(10)
let page = 1
let totalPages = 1

while (page <= totalPages) {
    let response = await fbClient.clients.list(accountId, [paginator])
    let { clients, pages } = response.data
    console.log(clients)
    console.log(`Page ${pages.page} of ${pages.pages} pages`)
    console.log(`Showing ${pages.size} per page for ${pages.total} total clients`)

    page++
    totalPages = pages.pages
    paginator.page(page)

    console.log('Clients:')
    clients.map((client) => console.log(client.organization))
}
```

#### Search Filters

To filter which results are return by `list` method calls, construct a `SearchQueryBuilder` and pass and pass it in
the `list` call.

The `SearchQueryBuilder` supports the patterns: `equals`, `in`, `like` and `between`.

```typescript
s = SearchQueryBuilder()
s.in("email", "api@freshbooks.com")
console.log(s.build()) // "&search[email]=api@freshbooks.com"

s = SearchQueryBuilder()
s.in("clientids", [123, 456])
console.log(s.build()) // "&search[clientids][]=123&search[clientids][]=456"

s = SearchQueryBuilder()
s.like("email_like", "@freshbooks.com")
console.log(s.build()) // "&search[email_like]=@freshbooks.com"

s = SearchQueryBuilder()
s.between("amount", 1, 10)
console.log(s.build()) // "&search[amount_min]=1&search[amount_max]=10)"

s = SearchQueryBuilder()
s.between("start_date", date.today())
console.log(s.build()) // &search[start_date]=2020-11-21
```

Example API client call with `SearchQueryBuilder`:

```typescript
import { SearchQueryBuilder } from '@freshbooks/api/dist/models/builders/SearchQueryBuilder'

//create and populate SearchQueryBuilder
const searchQueryBuilder = new SearchQueryBuilder()
    .like('address_like', '200 King Street')
    .between('date', { min: new Date('2010-05-06'), max: new Date('2019-11-10') })

try {
    // Get invoices matching search query
    const { data } = await client.invoices.list(accountId, [searchQueryBuilder])

    console.log('Invoices: ', data)
} catch ({ statusCode, message }) {
    // Handle error if API call failed
    console.error(`Error fetching user: ${statusCode} - ${message}`)
}
```

#### Includes

To include additional relationships, sub-resources, or data in a response an `IncludesQueryBuilder` can be constructed
which can then be passed into `list`, `single`, `create`, and `update` calls.

Example API client call with `IncludesQueryBuilder`:

```typescript
import { IncludesQueryBuilder } from '@freshbooks/api/dist/models/builders/IncludesQueryBuilder'

//create and populate IncludesQueryBuilder
const includesQueryBuilder = new IncludesQueryBuilder().includes('lines')
console.log(includesQueryBuilder.build()) // "&include[]=lines"

try {
    // Get invoices with included line items
    const { data } = await client.invoices.list(accountId, [includesQueryBuilder])

    console.log('Invoices: ', data)
} catch ({ statusCode, message }) {
    // Handle error if API call failed
    console.error(`Error fetching user: ${statusCode} - ${message}`)
}
```
