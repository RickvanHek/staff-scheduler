## Description

This solution has been build with [Nest](https://github.com/nestjs/nest) framework.

## Environment

Copy `example.env` to `.env` and adjust the variables where needed

## Docker

To run MySQL + the server through docker, run the below command:

```bash
$ docker compose up
```

## Running the app

If you have MySQL running and the environment file `.env` has been correctly set up with the correct MySQL variables, you can run the server with the following commands

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```
