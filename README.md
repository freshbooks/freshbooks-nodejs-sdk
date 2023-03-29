# FreshBooks NodeJS SDK

[![npm](https://img.shields.io/npm/v/@freshbooks/api)](https://www.npmjs.com/package/@freshbooks/api)
![node-lts](https://img.shields.io/node/v-lts/@freshbooks/api)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/freshbooks/freshbooks-nodejs-sdk/Run%20Tests)](https://github.com/freshbooks/freshbooks-nodejs-sdk/actions?query=workflow%3A%22Run+Tests%22)

The FreshBooks NodeJS SDK allows you to more easily utilize the FreshBooks API.

This repository contains multiple packages:

| Package | What it's for | Usage |
| ------- | ------------- | ----- |
| [`@freshbooks/api`](https://www.npmjs.com/package/@freshbooks/api) | Get/set data from FreshBooks using the REST API. | [README](packages/api/README.md) |
| [`@freshbooks/app`](https://www.npmjs.com/package/@freshbooks/app) | Pre-configured [ExpressJS](https://expressjs.com/) app. Includes authentication via [PassportJS](http://www.passportjs.org/). | [README](packages/app/README.md) |
| [sdk-examples](packages/sdk-examples/README.md) | SDK code examples | [README](packages/sdk-examples/README.md)|

## Installation

Use your favorite package manager to install any of the packages and save to your `package.json`:

```shell
$ npm install @freshbooks/api @freshbooks/app

# Or, if you prefer yarn
$ yarn add @freshbooks/api @freshbooks/app
```

## Usage

### `@freshbooks/api`

See the [API README](packages/api/README.md), the [full documentation](https://freshbooks.github.io/freshbooks-nodejs-sdk/) and check out some of our
[examples](https://github.com/freshbooks/freshbooks-nodejs-sdk/tree/main/packages/sdk-examples).

### `@freshbooks/app`

See the [APP README](packages/app/README.md).

## Development

### Testing

```shell
yarn install
yarn build
yarn test
```

### Releasing

1. Make sure everything is up to date locally
2. Update CHANGELOG.md and move any changes in "Unreleased" to the new version number
3. Commit changes and push to origin
4. Pull latest changes from origin
5. Update the package versions by executing: `./node_modules/.bin/lerna version`
6. After the new tags have been pushed to github, log in there and create a release from one of the new tags to push to npm.
