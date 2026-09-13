# AGENTS.md

Guide for AI agents (and humans) working in this repository. Read this before creating or changing a
mini-game.

## Mental model

```
Next.js (apps/web) ── platform pages + /api/* route handlers + Postgres (Drizzle)
      │ iframe (registry `url`)
      ▼
Mini-games (apps/<game-folder>) ── independent Vite apps on ports 5001…5016
      │ @game-platform/game-sdk (HTTP + postMessage)
      ▼
Game SDK / shared packages (packages/*)
```

- `apps/web` — the platform **and** the API. API routes live in `apps/web/app/api/**`.
- `apps/<game-folder>` — one independent game each. Implemented games use descriptive folder names;
  placeholder slots still use `game-NN`. Gameplay belongs here, nowhere else.
- `packages/config` — the game registry and ports (single source of truth).
- `packages/types` — shared types (`GameDefinition`, `GameResult`, `UserProgress`, …).
- `packages/game-sdk` — what games use to talk to the platform (`createGameSDK`, `reportGameResult`).
- `packages/ui` — React components used by the platform.

Games must never import the database layer or app internals. They only use the SDK.

## Commands

```bash
bun install                 # install + link workspaces
cp .env.example .env        # local env (root)
bun run db:up               # PostgreSQL (Docker)
bun run db:migrate          # apply Drizzle migrations
bun run dev                 # platform + API + all 16 games

bun run dev:web             # platform + API only
bun run dev:games           # all games
bun run dev:packages        # watch-build shared packages

bun run typecheck           # tsc --noEmit everywhere
bun run lint                # ESLint
bun run test                # Vitest
bun run format              # Prettier
bun run build               # production build (packages + apps)
```

> Packages are consumed from `dist/`. After editing anything in `packages/*`, run
> `bun run build:packages` (or keep `bun run dev:packages` running), otherwise apps see stale types.

## Ports

Platform + API `3000` · Game 01…16 `5001`…`5016`. A game's port is derived from its number:
`5000 + n` (`GAME_PORT_START = 5001` in `packages/config/src/constants.ts`).

## Create a new mini-game

Pick a slot number `N` (1–16). The steps are the same for a plain static game or a Vite + TypeScript
game.

### 1. Copy a starting point

```bash
# TypeScript + Vite game (recommended):
cp -r apps/plan-de-classe apps/game-17

# OR a static HTML/CSS/JS game: start from apps/fun-facts-algeriennes
```

### 2. Rename the workspace

In `apps/game-17/package.json`:

```json
{ "name": "@game-platform/game-17" }
```

### 3. Set the port

`apps/game-17/vite.config.ts`:

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 5017, strictPort: true },
  preview: { port: 5017, strictPort: true },
});
```

### 4. Implement the game

- TypeScript games: put code in `apps/game-17/src/`, entry `src/main.ts`, loaded by `index.html`.
- Static games: put assets/scripts in `apps/game-17/public/` and reference them with absolute paths
  (`/game.js`, `/assets/...`) from `index.html` at the app root.

The minimal Vite + TS shape:

```text
apps/game-17/
├── index.html          # <script type="module" src="/src/main.ts"></script>
├── src/main.ts         # game entry + finish reporting
├── src/style.css
├── vite.config.ts
├── tsconfig.json       # extends ../../tsconfig.json
└── package.json        # name, dev/build/test scripts, deps
```

### 5. Register it

`packages/config/src/games.ts` — add a `GAME_DETAILS` entry (name + description), and bump
`GAME_COUNT` in `packages/config/src/constants.ts`. The registry builds the `id`/`slug`/`url`
automatically from the slot number.

### 6. Link and run

```bash
bun install                                   # link the new workspace
bun run --filter @game-platform/game-17 dev
```

The game appears on `/games` automatically because that page renders the registry.

## Using the SDK and the finish util

### Report a finished game (the important one)

When a round ends, call `reportGameResult`. That is the whole integration: the platform takes care of
saving the score, marking the game played, and awarding points.

```ts
import { reportGameResult } from '@game-platform/game-sdk';

function endRound(score: number) {
  reportGameResult({
    gameId: 'game-17', // must match the registry id
    score, // points to award (additive)
    completed: true, // did the player finish?
    durationMs: 42_000, // optional
    metadata: { level: 3 }, // optional
  });
}
```

What happens next:

1. If the game runs inside the platform iframe, the SDK `postMessage`s `game:finished` to the parent.
   Standalone, it dispatches a `game:finished` DOM event (so the game still runs on its own).
2. `apps/web/components/game-frame.tsx` receives it, calls `POST /api/plays` with the current
   username, updates the points badge, and **falls back to the platform** (`/games`).
3. `POST /api/plays` marks the `(user, game)` play and adds `score` to `users.points`.

Notes:

- `score` is added to the player's total on every finish; `bestScore` is also stored per game for
  display.
- The player is whatever username is set in the header (`localStorage`, no auth yet).
- `gameId` must be the registry id (`game-17`), not the display name.

### Talk to the API directly

```ts
import { createGameSDK } from '@game-platform/game-sdk';

const sdk = createGameSDK({
  gameId: 'game-17',
  apiBaseUrl: import.meta.env.VITE_API_URL, // defaults to http://localhost:3000/api
});

await sdk.startSession();
await sdk.finishGame({ gameId: 'game-17', score: 10 });
```

The API base defaults to `http://localhost:3000/api`; CORS for `/api/*` is already handled. Not all
SDK endpoints exist yet (sessions/results/config are stubs).

## API reference

| Endpoint                | Method | Description                        |
| ----------------------- | ------ | ---------------------------------- |
| `/api/health`           | GET    | Liveness.                          |
| `/api/games`            | GET    | Enabled games from the registry.   |
| `/api/games/[gameId]`   | GET    | A single game.                     |
| `/api/users`            | POST   | Create a username.                 |
| `/api/users/[username]` | GET    | Player points + per-game progress. |
| `/api/plays`            | POST   | Record a finished game + points.   |

`POST /api/plays` body: `{ username, gameId, score, completed }`.

## Test a game

- Add a Vitest test next to the code (e.g. `src/game.test.ts`). Pure logic is easiest to test.
- Run one game's tests:

```bash
bun run --filter @game-platform/game-17 test
```

- Games default to `vitest run --passWithNoTests`; keep it or remove `--passWithNoTests` once you add
  tests.

## Rules (do not break these)

1. Gameplay lives in the game, never in `apps/web`.
2. Games never import the database layer, Drizzle, or `apps/web` internals.
3. Games communicate through `@game-platform/game-sdk` only.
4. Shared data/types/helpers belong in `packages/*`, not duplicated per game.
5. Every game must be independently runnable and buildable (`cd apps/<game-folder> && bun run build`).
6. One game's port must be unique (strictPort is on).
7. Never edit `dist/` or committed migrations by hand; regenerate via build / `bun run db:generate`.
8. Do not add a game to `GAME_DETAILS` without bumping `GAME_COUNT` (and vice-versa).

## Verification checklist

Before finishing any change:

```bash
bun run build:packages   # if packages changed
bun run typecheck
bun run lint
bun run test
bun run format:check
bun run build            # for anything affecting production output
```

Then smoke-test the running app (`bun run dev`): `/api/health`, `/games`, and the affected game port.

## Gotchas

- **Stale packages**: importing a new symbol from `packages/*` fails until `bun run build:packages`.
- **New workspace not linked**: `bun install` after adding an app.
- **Assets in `public/`**: reference them with absolute paths (`/assets/x.png`) so they survive the
  Vite build under any mount path.
- **`next build` needs Node**: the web build runs through a pinned `node-linux-x64` dev dependency
  because Bun trips a Next build bug. `next dev`/`next start` run fine on Bun.
- **Env loading**: the root `.env` is loaded by `apps/web/next.config.mjs`; games get `VITE_API_URL`
  at build time.

## Shared ETIC UI kit

The canonical shared visual kit is tracked at `etic-ui-kit/` in the repository root. Before
creating or changing an ETIC interface, read:

- `etic-ui-kit/.agents/skills/etic-ui/SKILL.md`
- `etic-ui-kit/docs/composition-workflow.md`
- `etic-ui-kit/docs/art-direction.md`
- `etic-ui-kit/etic-ui/asset-manifest.json`

Reuse the kit's components, tokens and assets instead of duplicating or recreating them. Use one
colored ribbon family per page—warm **or** cool—across every section. On a large red banner, choose
a warm yellow/orange or light ribbon, never a green/teal ribbon. Read each candidate asset's
`ribbonFamily`, `containsRibbonFamilies` and `pairingGuidance` before using it.

Distinguish geometric `primitive`, `module` and `composition` assets. Modules and compositions can
contain deliberate whitespace, overlap and cropping; preserve that intent and do not stretch them
to fill a box. Keep gameplay, score reporting, callbacks, canvas effects and game-specific styles
outside the shared kit. See `docs/etic-ui-kit.md` for repository-specific imports and ownership.
