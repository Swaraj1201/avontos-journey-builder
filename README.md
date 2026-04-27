# 🧩 Avantos Journey Builder – Prefill Mapping UI

This project implements a prefill configuration UI for a DAG-based form system, similar to what Avantos is building.

Users can:

- View forms
- Understand upstream dependencies
- Configure field-level prefill mappings between forms

## ⚙️ How to Run Locally

You need **two terminals**. The Vite app proxies `/api` to `http://127.0.0.1:3000`, so the mock server must be running or you will see `ECONNREFUSED` / proxy errors.

### Folder layout

`avontos-journey-builder` and `frontendchallengeserver` are **sibling** directories under the same parent (e.g. `Avantos/`). There is **no** `avontos-journey-builder` folder inside `frontendchallengeserver`.

```
parent/
├── avontos-journey-builder/   ← frontend (Vite, port 5173)
└── frontendchallengeserver/   ← mock API (port 3000)
```

### 1. Clone and enter the frontend app

```bash
git clone https://github.com/Swaraj1201/avontos-journey-builder.git
cd avontos-journey-builder   # or: cd <repo-name> if your clone root is different
npm install
```

### 2. Terminal A — mock API (start this first)

```bash
cd ../frontendchallengeserver   # from avontos-journey-builder; or cd frontendchallengeserver from parent
npm install
npm start
```

Leave this running. You should see: `Server is running on http://localhost:3000`.

### 3. Terminal B — frontend

```bash
cd avontos-journey-builder   # path to this repo’s root
npm run dev
```

### 4. Open app

[http://localhost:5173](http://localhost:5173)

### Troubleshooting

| Problem | Cause | Fix |
|--------|--------|-----|
| `cd: no such file or directory: avontos-journey-builder` while inside `frontendchallengeserver` | That folder is not nested there | Use `cd ../avontos-journey-builder`, or open a new shell and `cd` to the real path |
| `Missing script: "dev"` | `npm run dev` ran in the mock server folder (no Vite) | `cd` to `avontos-journey-builder` then `npm run dev` |
| `http proxy error` / `ECONNREFUSED 127.0.0.1:3000` | Mock server not listening on 3000 | In another terminal, `cd ../frontendchallengeserver && npm start` |

## 🧠 Key Concepts

### 1. Forms as a DAG

Forms are connected in a Directed Acyclic Graph (DAG).

```
A → B → D
A → C → E
```

👉 A form can only prefill from its upstream forms.

### 2. Prefill Mapping

Each form field can be mapped to:

- A field from an upstream form
- (Future) global data source

**Example:** Email field → Prefilled from Form A → Email

### 3. Upstream Traversal

Implemented using DFS (Depth-First Search):

- Traverses `edge.to` → `edge.from`
- Handles:
  - Direct dependencies
  - Transitive dependencies
  - Cycle safety
  - Deduplication

## 🏗️ Architecture

```
src/
  components/   → UI (PrefillPanel, MappingModal)
  services/     → API layer
  hooks/        → data fetching logic
  utils/        → DAG traversal logic
  types/        → shared types

tests/
  utils/
    graph.test.ts → unit tests for traversal logic
```

## 🧪 Testing

Tests are implemented using Vitest.

Run:

```bash
npm run test
```

Covers:

- Direct upstream forms
- Transitive dependencies
- Branching graphs
- Cycle safety
- Duplicate handling
- Edge cases

## 🔌 Extensibility (Important Design Choice)

Prefill mapping uses a flexible source model:

```ts
type SourceType = 'form' | 'global'
```

This allows:

- Adding new data sources without changing core logic
- Supporting future extensions like:
  - Global properties
  - External APIs

## 🎯 UX Improvements

- Clear step-by-step flow
- Empty state handling: “No upstream data sources available for this form.”
- Readable mapping display
- Click-to-map interaction

## 🚀 Future Improvements

- Add global data sources (Action/Client properties)
- Add search/filter in mapping modal
- Improve visual DAG representation
- Expand test coverage for UI interactions

## 📌 Notes

- Focus was on correctness, extensibility, and usability
- UI is intentionally simple but structured for clarity
