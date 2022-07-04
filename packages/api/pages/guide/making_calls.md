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
    code: string
    message?: string
    errors?: []
}
```

Examples:

```typescript
clientData = {}
try {
  const client = await fbClient.clients.single(accountId, 00000)
  console.log('Not called')
} catch (err) {
  console.log(err.message)
  console.log(err.code)
  console.log(err.errors)
}
/*
Output:
NOT FOUND
404
[
  {
    number: 1012,
    field: 'userid',
    message: 'Client not found.',
    object: 'client',
    value: '64080700'
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
  console.log(err.message)
  console.log(err.code)
  console.log(err.errors)
}
/*
Output:
UNPROCESSABLE ENTITY
422
[
  {
    number: 7012,
    field: null,
    message: 'At least one field among fname, lname, email and organization is required.',
    object: 'client',
    value: ''
  }
]
*/
```
