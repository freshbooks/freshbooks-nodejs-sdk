# FreshBooks NodeJS SDK

![](https://github.com/freshbooks/api-sdk/workflows/Node%20CI/badge.svg)

The FreshBooks NodeJS SDK is a collection of single-purpose packages designed to easily build FreshBooks apps. Each package delivers part of the FreshBooks [REST API](https://www.freshbooks.com/api), so that you can choose the packages that fit your needs.

| Package                             | What it's for                                                                                                                 |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [`@freshbooks/api`](#freshbooksapi) | Get/set data from FreshBooks using the REST API.                                                                              |
| `@freshbooks/events`                | Register/listen for incoming events via webhooks.                                                                             |
| [`@freshbooks/app`](#freshbooksapp) | Pre-configured [ExpressJS](https://expressjs.com/) app. Includes authentication via [PassportJS](http://www.passportjs.org/). |

## Installation

Use your favorite package manager to install any of the packages and save to your `package.json`:

```shell
$ npm install @freshbooks/api @freshbooks/events @freshbooks/app

# Or, if you prefer yarn
$ yarn add @freshbooks/api @freshbooks/events @freshbooks/app
```

## Usage

### `@freshbooks/events`
