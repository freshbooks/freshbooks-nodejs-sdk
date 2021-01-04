# FreshBooks Node SDK Changelog

## @freshbooks/api

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
