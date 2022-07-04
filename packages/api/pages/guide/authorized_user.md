# Authorized User

FreshBooks users are uniquely identified by their email across our entire product. One user may act on several
Businesses in different ways, and our Identity model is how we keep track of it. Each unique user has an Identity, and
each Identity has Business Memberships which define the permissions they have.

See [FreshBooks API - Business, Roles, and Identity](https://www.freshbooks.com/api/me_endpoint) and
[FreshBooks API - The Identity Model](https://www.freshbooks.com/api/identity_model).

The current user can be accessed by:

```typescript
const identity = await fbClient.users.me()

if (identity.ok === true) {
  console.log(identity.data.email)
  identity.data.businessMemberships.forEach((businessMembership) => {
    console.log(`${businessMembership.business.name}`)
  }
}
```
