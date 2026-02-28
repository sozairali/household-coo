# Frontend — React / TypeScript / Tailwind Rules

## Architecture Layers
```
pages/         Route-level components. Compose features, own no fetch logic.
components/    Dumb, reusable UI. Props in, events out.
services/      All data access, localStorage, API calls.
state/store.ts Zustand store. Single source of truth.
types.ts       Shared types. No logic here.
```

## File Size
- Hard limit: 200 lines per file.
- Large components → extract child components or hooks.

## Component Rules
- Functional components only; no classes.
- One component per file. File name matches export name.
- Props interface defined at the top of the file.
- No `fetch` calls inside components — delegate to a service then surface via the store.

```typescript
// Good
function SpotlightCard({ task, onDone, onDismiss }: SpotlightCardProps) { ... }

// Bad — fetch inside component
function SpotlightCard() {
  const [task, setTask] = useState(null);
  useEffect(() => { fetch('/api/tasks').then(...) }, []);
}
```

## TypeScript
- Strict mode on. No `any`. Use `unknown` + type guard when type is truly unknown.
- Prefer `interface` over `type` for object shapes.
- Avoid enums; use `as const` maps or union string literals (already done in `types.ts`).
- All exported functions and component props must be typed.

## State Management (Zustand)
- All async operations live in store actions.
- After every mutation, persist with `persistenceService.save(...)`.
- Store actions must not throw to the component — catch and set an error state.

## Separation of Concerns
- `budgetService` — pure budget ledger logic (read/write localStorage).
- `scoringService` — pure scoring/ranking logic.
- `persistenceService` — serialise/deserialise full app state.
- Services must not import from each other circularly.
- Store imports services; services do not import the store.

## Styling
- **Only CSS variables** — never hardcoded Tailwind colour classes (`bg-gray-*`, `text-blue-*`).
- Required mappings: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `bg-primary`.
- Touch targets: minimum `min-h-[44px] min-w-[44px]` on interactive elements.
- Large text (`text-4xl`+) must have `overflow-hidden` and `line-clamp-*`.

## Naming
- Directories: `kebab-case` (e.g. `components/task-drawer/`).
- Component files: `PascalCase.tsx`.
- Service/hook files: `camelCase.ts`.
- Boolean variables: `isLoading`, `hasError`, `canDismiss`.

## Imports
- Use `@/` alias for all internal imports.
- Group order: external libs → internal modules → types.

## Atomic Frontend Writes
- `persistenceService.save()` always writes the complete serialised state object.
- Never call `localStorage.setItem` directly outside of service files.
