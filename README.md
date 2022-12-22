## Description

This solution has been build with [Nest](https://github.com/nestjs/nest) framework.

## Environment

Copy `example.env` to `.env` and adjust the variables where needed

## Docker

To run MySQL + the server through docker, run the below command:

```bash
$ docker compose up
```

## Bypassing the admin authentication

For testing purpose, if you register a user by using the provided endpoint `POST /user/register` with the email: `admin@admin.com` you will be automatically marked as an admin user. Note that this is only for demonstration purposes, in real scenarios this would not be used.

## Running the app locally

Install the dependencies by executing

```bash
$ yarn install
```

If you have MySQL running and the environment file `.env` has been correctly set up with the correct MySQL variables, you can run the server with the following commands

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev
```

## Documentation

The documentation page can found at http://localhost:3000/api after running the project. This will work either when running through Docker or locally.

## Test

Before running tests, make sure the packages are installed using

```bash
$ yarn install
```

After this, to run the tests, execute:

```bash
$ yarn test
```
