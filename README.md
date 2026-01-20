# Star Wars Core API

- Available at https://star-wars-core-api.onrender.com/api

## Prerequisites

- Node >= @18.12.0.
- Docker.

## Installation

1. Run `npm ci` to install the project's dependencies.
2. Create a `.env` file on the project root following the format specified on `.env.dist`.
3. Spin up the docker container by running `docker compose up -d`.
4. Run `npm run start:dev` to start the app on watch mode.

## Environment Variables

| Variable      | Description                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| `PORT`        | Nest application port. Defaults to '3000' if not specified                                            |
| `NODE_ENV`    | Current environment. Use 'development' for local                                                      |
| `DB_HOST`     | Postgres database host. Use 'localhost' for local or 'host.docker.internal' if running docker-compose |
| `DB_PORT`     | Postgres database port. Use '5432' for local                                                          |
| `DB_USERNAME` | Postgres database user. Use 'postgres' for local                                                      |
| `DB_PASSWORD` | Postgres database password. Use 'example' for local                                                   |
| `DB_NAME`     | Postgres database name. Use 'sw_api' for local                                                        |
| `JWT_SECRET`  | JWT secret to sign and check tokens. Can be any string or Buffer                                      |

## Run

- `docker compose up` to run the local Postgres database used for development.
- `npm run start:dev` to start Nest application on watch mode.
- `npm run build` to generate a build.
- `npm run start` to start Nest application with the current build.

## Testing

```
npm run test
# Runs all tests once.

npm run test
# Runs all tests in watch mode.

npm run test:cov
# Runs all tests once and outputs coverage in ./coverage.
```

## Migrations

```
npm run migrate:generate --name=your-migration-name
# Generates a new migration file based on the differences between your schema and your local database.

npm run migrate:run
# Runs all available migrations from ./migrations.

npm run migrate:revert
# Reverts the last migration that you ran.
```

## Initial data

- Run `sql/insert_admin_user.sql` to insert an admin user.
