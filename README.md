# @corvid-agent/pipe

Functional pipe and compose with full TypeScript type inference. Zero dependencies.

## Install

```bash
npm install @corvid-agent/pipe
```

## Usage

### pipe — left-to-right value transformation

```ts
import { pipe } from "@corvid-agent/pipe";

const result = pipe(
  5,
  (x) => x * 2,
  (x) => x + 1,
  (x) => `Result: ${x}`,
);
// "Result: 11"
```

### pipeAsync — async pipeline

```ts
import { pipeAsync } from "@corvid-agent/pipe";

const user = await pipeAsync(
  userId,
  fetchUser,
  (user) => user.email,
  sendWelcomeEmail,
);
```

### flow — create reusable pipelines

```ts
import { flow } from "@corvid-agent/pipe";

const process = flow(
  (x: number) => x * 2,
  (x) => x + 1,
  (x) => `Result: ${x}`,
);

process(5);  // "Result: 11"
process(10); // "Result: 21"
```

### compose — right-to-left (mathematical)

```ts
import { compose } from "@corvid-agent/pipe";

const transform = compose(
  (x: number) => `Result: ${x}`,
  (x: number) => x + 1,
  (x: number) => x * 2,
);
transform(5); // "Result: 11"
```

### Pipeline Utilities

```ts
import { pipe, tap, when, branch, tryCatch, map, filter, reduce, prop } from "@corvid-agent/pipe";

// tap — side effects without modifying the value
pipe(data, tap(console.log), transform);

// when — conditional transform
pipe(value, when(x => x > 0, x => x * 2));

// branch — if/else in pipeline
pipe(value, branch(x => x > 0, handlePositive, handleNegative));

// tryCatch — error handling
pipe(input, tryCatch(JSON.parse, (err, raw) => ({ error: true })));

// Array operations
pipe(
  [1, 2, 3, 4, 5],
  filter(x => x % 2 === 0),
  map(x => x * x),
  reduce((sum, x) => sum + x, 0),
);

// Property access
pipe({ name: "Alice" }, prop("name")); // "Alice"
```

## API

| Function | Description |
|----------|-------------|
| `pipe(value, ...fns)` | Transform value through functions left-to-right |
| `pipeAsync(value, ...fns)` | Async pipe (supports sync/async functions) |
| `flow(...fns)` | Create a left-to-right pipeline function |
| `compose(...fns)` | Create a right-to-left pipeline function |
| `tap(fn)` | Side effect, returns value unchanged |
| `tapAsync(fn)` | Async side effect |
| `when(pred, fn)` | Conditional transform |
| `branch(pred, ifTrue, ifFalse)` | If/else branching |
| `tryCatch(fn, onError)` | Error handling |
| `map(fn)` | Array map in pipeline |
| `filter(pred)` | Array filter in pipeline |
| `reduce(fn, init)` | Array reduce in pipeline |
| `prop(key)` | Property accessor |
| `identity` | Returns value unchanged |
| `constant(value)` | Always returns the same value |

## License

MIT
