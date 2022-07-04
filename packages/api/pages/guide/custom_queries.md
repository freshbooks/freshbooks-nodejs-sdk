# Pagination, Filters, and Includes

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

## Pagination

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

## Search Filters

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
} catch ({ code, message }) {
    // Handle error if API call failed
    console.error(`Error fetching user: ${code} - ${message}`)
}
```

## Includes

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
} catch ({ code, message }) {
    // Handle error if API call failed
    console.error(`Error fetching user: ${code} - ${message}`)
}
```
