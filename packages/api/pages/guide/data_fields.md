# Data Field Notes

## Dates and Times

For historical reasons, many resources in the FreshBooks API (mostly accounting-releated) return date/times in
"US/Eastern" timezone. Some effort is taken to convert these in the models to return `Date` objects normalized to UTC.

## Monetary Values

The FreshBooks API returns most monetary values as a money object containing the amount and a currency code:

```typescript
export default interface Money {
    amount?: string
    code?: string
}
```

The amount is returned and stored as a string to prevent floating point precision issues. If you are doing
calculations on these values, it is recommended to use a library for decimal arithmetic such as
[decimal.js](https://www.npmjs.com/package/decimal.js), [big.js](https://www.npmjs.com/package/big.js),
or [bignumber.js](https://www.npmjs.com/package/bignumber.js)
