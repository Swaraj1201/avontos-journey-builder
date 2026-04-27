# 🧩 Avantos Journey Builder – Prefill Mapping UI

This project implements a prefill configuration UI for a DAG-based form system, similar to what Avantos is building.

Users can:

- View forms
- Understand upstream dependencies
- Configure field-level prefill mappings between forms

## ⚙️ How to Run Locally

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <repo-name>
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Start frontend

```bash
npm run dev
```

### 4. Start mock server

From the same parent directory as this project, the mock server lives in `frontendchallengeserver`:

```bash
cd ../frontendchallengeserver
npm install
npm start
```

### 5. Open app

[http://localhost:5173](http://localhost:5173)

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
