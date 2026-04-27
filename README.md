# Avantos Journey Builder - Prefill Mapping UI

This project implements a prefill configuration UI for a DAG-based form system.

Users can:
- View forms
- Understand dependencies
- Map fields from upstream forms

## Setup

1. Clone repo
2. Install dependencies

```bash
npm install
```

3. Start frontend

```bash
npm run dev
```

4. Start mock server

```bash
cd frontendchallengesserver
npm install
npm start
```

5. Open app

`http://localhost:5173`

## Key Concepts

- Forms are nodes in a DAG
- Prefill only allowed from upstream forms
- Mapping is field-to-field

## Architecture

- `services/` -> API layer
- `hooks/` -> data fetching logic
- `utils/` -> DAG traversal (DFS)
- `types/` -> shared types

## Extensibility

Prefill mapping uses a generic `SourceType`:

```ts
type SourceType = 'form' | 'global'
```

This allows new data sources to be added without modifying existing logic.
