# Node API

Technical reference for developing, testing, and running this TypeScript API.

## Requirements

- Node.js 22.12 or newer
- npm

Vitest 5 and parts of the Prisma toolchain require a modern Node.js runtime.

## Getting started

```sh
npm install
cp .envexample .env
npm run dev
```

The development server starts on `http://localhost:3000` by default. The
interactive OpenAPI reference is available at `/reference`, and the generated
OpenAPI document is available at `/openapi.json`.

The application validates its environment during startup:

| Variable       | Required | Default                   | Description                                                                         |
| -------------- | -------- | ------------------------- | ----------------------------------------------------------------------------------- |
| `DATABASE_URL` | Yes      | —                         | Prisma connection URL; the current adapter is SQLite.                               |
| `PORT`         | No       | `3000`                    | HTTP port. Must be a positive integer.                                              |
| `API_BASE_URL` | No       | `http://localhost:<PORT>` | Public server URL used in startup output and OpenAPI. Must be a valid URL when set. |

The example values are in [.envexample](./.envexample). Copy the file to `.env`
for local development; `.env` is ignored by Git.

## Commands

| Command                 | Description                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| `npm run dev`           | Run the API with `tsx` watch mode.                                                                    |
| `npm run build`         | Compile TypeScript into `dist/` and rewrite path aliases for Node.js.                                 |
| `npm start`             | Run the compiled application from `dist/index.js`.                                                    |
| `npm test`              | Run the Vitest suite once.                                                                            |
| `npm run test:coverage` | Run tests and print coverage in the terminal; also generate the HTML report at `coverage/index.html`. |
| `npm run typecheck`     | Type-check application source without emitting files.                                                 |
| `npm run format:check`  | Check Prettier formatting in `src/`.                                                                  |
| `npm run format:fix`    | Format TypeScript files in `src/`.                                                                    |
| `npm run lint`          | Run ESLint on `src/`.                                                                                 |
| `npm run lint:fix`      | Run ESLint with automatic fixes on `src/`.                                                            |
| `npm run check`         | Run formatting, lint, and source type checks.                                                         |

Tests are under `tests/` and use Vitest. The test TypeScript project is
`tests/tsconfig.json`. Test runtime aliases are configured in
[vitest.config.ts](./vitest.config.ts); source aliases use `@/*` as configured
in [tsconfig.json](./tsconfig.json).

## Architecture

The source is organized as a small layered application:

```text
src/
  api/             HTTP routes, controllers, schemas, middleware, API docs
  application/     Use cases/services, DTOs, application errors
  model/           Domain models, repository contracts, shared model types
  infrastructure/  Persistence adapters and external integrations
  config/          Environment parsing and validation
  generated/       Generated Prisma client (do not edit manually)
```

### Request and persistence flow

1. Express routes dispatch requests to API controllers.
2. Controllers validate HTTP inputs with Zod schemas and translate results
   into the shared JSON response format.
3. Application services coordinate use cases, map domain objects to DTOs,
   and translate domain validation failures to application errors.
4. Domain models own business invariants. Repository interfaces in `model/`
   define persistence operations without depending on Prisma.
5. The Prisma repository implements those contracts and maps database records
   to domain models.
6. Express error middleware maps application and database errors to HTTP
   responses.

Keep dependencies pointing inward: API and infrastructure can depend on
application/domain contracts, while the domain model should not depend on
Express, Zod, or Prisma.

### Persistence

The Prisma schema is in `prisma/schema.prisma`; migration history is in
`prisma/migrations/`. The generated Prisma client is written under
`src/generated/prisma/`. Treat generated files as build output rather than
hand-maintained source.

## Testing strategy

Tests are grouped by layer:

- `tests/api/` covers controllers, routes, middleware, and OpenAPI generation.
- `tests/application/` covers service behavior using repository doubles.
- `tests/model/` covers domain invariants.
- `tests/infrastructure/` covers Prisma repository/client behavior using
  mocks, without requiring a running database.
- `tests/config/` covers environment parsing and validation.

Coverage uses Vitest's V8 provider. HTML output is written to `coverage/`,
which is ignored by Git.
