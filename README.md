# Game Platform

A Bun monorepo for a web platform that hosts **16 independent mini-games**.

The platform, the API, the shared packages and every mini-game live in a single repository but remain
independently buildable and deployable. Gameplay is intentionally **not** implemented yet — this
repository is the foundation.

## What is in here

| Piece           | Technology                            | Location             |
| --------------- | ------------------------------------- | -------------------- |
| Platform + API  | Next.js (App Router + route handlers) | `apps/web`           |
| 16 mini-games   | Vite + TypeScript                     | `apps/<game-folder>` |
| Shared Game SDK | TypeScript                            | `packages/game-sdk`  |
| Shared types    | TypeScript                            | `packages/types`     |
| Shared UI       | React + TypeScript                    | `packages/ui`        |
| Shared config   | TypeScript                            | `packages/config`    |
| Database        | PostgreSQL + Drizzle                  | `apps/web/db`        |

## Architecture

```text
                  ┌──────────────────────────┐
                  │        Next.js           │
                  │  platform + /api routes  │
                  └────────────┬─────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
    Game 01                Game 02                Game 16
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                          Game SDK
                               │
                               ▼
                     ┌───────────────────┐
                     │  Next.js /api/*   │
                     │  (route handlers) │
                     └─────────┬─────────┘
                               │
                               ▼
                     ┌───────────────────┐
                     │    PostgreSQL     │
                     │     username      │
                     └───────────────────┘
```

- Games are independent frontends. They never import app internals or database code.
- Games talk to the API only through `@game-platform/game-sdk` over HTTP.
- The API lives in the same Next.js app as the platform, under `/api/*`.
- The database currently stores **only a username**.

See [`docs/architecture.md`](docs/architecture.md) for details.

## Monorepo structure

```text
game-platform/
├── apps/
│   ├── web/            # Next.js platform + API (app/api/*)
│   ├── fun-facts-algeriennes/
│   ├── hidden-object/
│   ├── plan-de-classe/
│   ├── wordle-algerien/
│   ├── kalimat-algerien/
│   ├── spelling-bee-algerien/
│   └── game-07 … game-16/
├── packages/
│   ├── game-sdk/       # HTTP abstraction used by games
│   ├── types/          # shared TypeScript types
│   ├── ui/             # shared React components
│   └── config/         # game registry, ports, API helpers
├── docker/
│   └── docker-compose.yml
├── docs/
│   ├── architecture.md
│   ├── games.md
│   └── development.md
├── .env.example
├── package.json        # Bun workspace root
└── tsconfig.json
```

## Requirements

- [Bun](https://bun.sh) `>= 1.2` (package manager **and** runtime)
- Docker + Docker Compose (for local PostgreSQL)

> This project uses **Bun only**. Do not use npm, pnpm or Yarn.

### Install Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

## Getting started

```bash
# 1. Install dependencies for every workspace
bun install

# 2. Create your local environment file
cp .env.example .env

# 3. Start PostgreSQL
bun run db:up

# 4. Apply the database schema with Drizzle migrations
bun run db:migrate

# 5. Build the shared packages once, then start everything
bun run dev
```

`bun run dev` starts the platform/API and all 16 games.

## Ports

| Service                | URL                       |
| ---------------------- | ------------------------- |
| Next.js platform + API | http://localhost:3000     |
| API base               | http://localhost:3000/api |
| Game 01                | http://localhost:5001     |
| Game 02                | http://localhost:5002     |
| …                      | …                         |
| Game 16                | http://localhost:5016     |

## Running a specific application

Every workspace can be run from its own directory:

```bash
cd apps/fun-facts-algeriennes && bun run dev  # a single game
cd apps/web && bun run dev                       # the platform + API
```

Or from the root:

```bash
bun run dev:web        # platform + API only
bun run dev:games      # all 16 games
bun run --filter @game-platform/game-01 dev
```

## API

All endpoints are Next.js route handlers under `apps/web/app/api`:

| Endpoint                | Method | Description                      |
| ----------------------- | ------ | -------------------------------- |
| `/api/health`           | GET    | Liveness check.                  |
| `/api/games`            | GET    | Enabled games from the registry. |
| `/api/games/[gameId]`   | GET    | A single game.                   |
| `/api/users`            | POST   | Create a username.               |
| `/api/users/[username]` | GET    | Player points + game progress.   |
| `/api/plays`            | POST   | Record a finished game + points. |

CORS is enabled for `/api/*` by `apps/web/middleware.ts` so games on other origins can call it.

## How the platform launches a game

The single source of truth is the registry in `packages/config/src/games.ts`. Each entry has an
`id`, `name`, `description`, `version`, `enabled` and a `url`:

```ts
{
  id: 'game-01',
  slug: 'game-01',
  name: 'Fun Facts Algériennes',
  description: '…',
  version: '0.1.0',
  enabled: true,
  url: 'http://localhost:5001',
}
```

The web platform renders the registry on `/games`. `/games/[gameId]` looks the game up and loads it
from its `url` in an `<iframe>` (and offers an "open in a new tab" link). Because games are addressed
by URL, they can later be hosted independently, e.g. `game-01.example.com` or
`platform.example.com/games/game-01`.

## Using the Game SDK

Games receive an instance of the SDK and use it to talk to the API:

```ts
import { createGameSDK } from '@game-platform/game-sdk';

const sdk = createGameSDK({ gameId: 'game-01' });

const session = await sdk.startSession();
// … play the game …
await sdk.finishGame({ gameId: 'game-01', score: 42, durationMs: 12_000 });
```

The SDK resolves the API base URL for you and defaults to `http://localhost:3000/api`. It currently
exposes `startSession`, `finishGame`, `getPlayer` and `getGameConfig`; those endpoints will be
implemented when the requirements are known.

## Creating a new game (Game 17)

1. Copy an existing game: `cp -r apps/fun-facts-algeriennes apps/game-17`.
2. Update `apps/game-17/package.json` (`name`, `version`).
3. Set a unique dev port in `apps/game-17/vite.config.ts`.
4. Update the game identity in its source.
5. Add an entry to the registry in `packages/config/src/games.ts`.
6. Increase `GAME_COUNT` in `packages/config/src/constants.ts`.
7. Run `bun install` so the new workspace is linked.

More detail in [`docs/games.md`](docs/games.md).

## Database

PostgreSQL is managed with Docker Compose. Drizzle keeps a single `users` table with a unique
`username`:

```bash
bun run db:up          # start PostgreSQL in the background
bun run db:generate    # generate a SQL migration from the Drizzle schema
bun run db:migrate     # apply pending migrations
bun run db:push        # push the schema without a migration (dev shortcut)
bun run db:studio      # open Drizzle Studio
bun run db:down        # stop PostgreSQL
```

The only user data stored today is `username`. The schema is deliberately minimal and easy to
extend later.

## Production build

```bash
bun run build                                   # packages + platform/API + all games
bun run --filter @game-platform/web start       # runs the built Next.js app (platform + API)
```

Each game is built to `apps/game-NN/dist` (static files) and can be hosted anywhere; the registry
`url` points at wherever it lives.

## Quality checks

```bash
bun run lint
bun run typecheck
bun run test
bun run format
```

- **Vitest** — games, web (including a `GET /api/health` test) and shared packages.
- **ESLint (flat config) + Prettier** — shared at the repository root.

> Bun runs the development servers and the API. Only `next build` uses the pinned Node runtime
> (`node-linux-x64`) because it trips a Bun/Next interop bug. See
> [`docs/development.md`](docs/development.md#runtime-notes).

## Documentation

- [`docs/architecture.md`](docs/architecture.md) — how the pieces fit together.
- [`docs/games.md`](docs/games.md) — adding and running games.
- [`docs/development.md`](docs/development.md) — day-to-day development workflow.
- [`AGENTS.md`](AGENTS.md) — setup + mini-game integration guide for agents.
# for-lamis
