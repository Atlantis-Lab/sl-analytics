# microfleet

## Run dev

1. `docker-compose run yarn`
2. `docker-compose up gateway auth collector`

## Run test

1. `docker-compose -f docker-compose.test.yml run test`

## Description packages

1. Auth – used to verify tokens (slr? And jwt).
2. Collector – used to collect data.
3. Gateway – used to proxing user requests.
