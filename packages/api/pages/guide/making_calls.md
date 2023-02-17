# Making API Calls

Most resources in the client provides calls for `list`, `single`, `create`, `update` and `delete`. Please note that
some API resources are scoped to a FreshBooks `accountId` while others are scoped to a `businessId`. In general these
fall along the lines of accounting resources vs projects/time tracking resources, but that is not precise.

```typescript
const client = await fbClient.clients.single(accountId, clientUserId)
const project = await fbClient.projects.single(businessId, projectId)
```

All REST API methods return a response in the shape of:

```typescript
{
  ok: boolean
  data?: T // model type of result
  error?: Error
}
```

For historical reasons, some resources in the FreshBooks API (mostly accounting-releated) return date/times in
"US/Eastern" timezone. The SDK will convert these in the models to return `Date` objects normalized to UTC.

## List and Single

To fetch a list of resources:

```typescript
const clients = await fbClient.clients.list(accountId)

if (clients.ok === true) {
  identity.data.clients.forEach((client) => {
    console.log(`'${client.email}' is the email for '${client.organization}'`)
  }
}
```

To fetch a single resource:

```typescript
const client = await fbClient.clients.single(accountId, clientUserId)

if (client.ok === true) {
    console.log(`'${client.email}' is the email for '${client.organization}'`)
}
```

## Create, Update, and Delete

API calls to `create` and `update` take a resource Model and return an updated Model on a successful call as if a call
to `single`.

Create:

```typescript
const clientData = {"email": "john.doe@abcorp.com"}
const newClient = await fbClient.clients.create(clientData, accountId)

console.log(`Created client ${client.data.id}`)
```

Update:

```typescript
const updateData = {"email": "john.doe@abcorp.ca"}
const client = await fbClient.clients.update(updateData, accountId, clientId)

console.log(`Update client ${clientId} email to ${client.data.email}`)
```

Delete:

```typescript
const client = await fbClient.clients.delete(accountId, clientId)

console.log(`Client visState is now ${client.data.visState}`)
```

## Error Handling

Calls made to the FreshBooks API with a non-2xx response result in errors in the form of:

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
