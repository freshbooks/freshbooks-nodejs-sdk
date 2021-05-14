# FreshBooks Node SDK Changelog

## @freshbooks/api

### Unreleased

### 1.4.0

- Added Other Income resource
- Fixed user.me() call for partially setup businesses

### 1.3.0

- Added Project resource
- Client model fixes
- Standardize date/time objects to UTC (accounting endpoints return data in EST)

### 1.2.0

- Added TimeEntry resource

### 1.1.3

- `like` filters no longer automatically append `_like` to the search key.
  Correct key must now be provided.
- Fix issue where `in` filters were not correctly being generated.

### 1.1.2

- Now retrying on 429 errors on POST, PUT
- Tune retries to 10 attempts (was 3)

### 1.1.0

- Added default retries with backoff on failed API calls

## @freshbooks/app

### 1.0.6

## @freshbooks/events

### 0.1.2
