import { describe, test, expect, mock } from "bun:test";
import {
  pipe,
  pipeAsync,
  compose,
  flow,
  tap,
  tapAsync,
  when,
  branch,
  tryCatch,
  map,
  filter,
  reduce,
  prop,
  identity,
  constant,
} from "../src/index";

// ── pipe ───────────────────────────────────────────────────────────────

describe("pipe", () => {
  test("returns value with no functions", () => {
    expect(pipe(5)).toBe(5);
  });

  test("applies single function", () => {
    expect(pipe(5, (x) => x * 2)).toBe(10);
  });

  test("chains multiple functions", () => {
    const result = pipe(
      5,
      (x) => x * 2,
      (x) => x + 1,
      (x) => `Result: ${x}`,
    );
    expect(result).toBe("Result: 11");
  });

  test("works with different types", () => {
    const result = pipe(
      "hello",
      (s) => s.toUpperCase(),
      (s) => s.split(""),
      (arr) => arr.length,
    );
    expect(result).toBe(5);
  });

  test("works with objects", () => {
    const result = pipe(
      { x: 1, y: 2 },
      (p) => ({ ...p, z: p.x + p.y }),
      (p) => p.z,
    );
    expect(result).toBe(3);
  });
});

// ── pipeAsync ──────────────────────────────────────────────────────────

describe("pipeAsync", () => {
  test("resolves value with no functions", async () => {
    expect(await pipeAsync(5)).toBe(5);
  });

  test("handles sync functions", async () => {
    const result = await pipeAsync(
      5,
      (x) => x * 2,
      (x) => x + 1,
    );
    expect(result).toBe(11);
  });

  test("handles async functions", async () => {
    const result = await pipeAsync(
      5,
      async (x) => x * 2,
      async (x) => x + 1,
    );
    expect(result).toBe(11);
  });

  test("handles mixed sync and async", async () => {
    const result = await pipeAsync(
      "hello",
      (s) => s.toUpperCase(),
      async (s) => `${s}!`,
      (s) => s.length,
    );
    expect(result).toBe(6);
  });
});

// ── compose ────────────────────────────────────────────────────────────

describe("compose", () => {
  test("composes single function", () => {
    const fn = compose((x: number) => x * 2);
    expect(fn(5)).toBe(10);
  });

  test("composes right-to-left", () => {
    const fn = compose(
      (x: number) => `Result: ${x}`,
      (x: number) => x + 1,
      (x: number) => x * 2,
    );
    expect(fn(5)).toBe("Result: 11");
  });
});

// ── flow ───────────────────────────────────────────────────────────────

describe("flow", () => {
  test("flows left-to-right", () => {
    const fn = flow(
      (x: number) => x * 2,
      (x) => x + 1,
      (x) => `Result: ${x}`,
    );
    expect(fn(5)).toBe("Result: 11");
  });

  test("single function", () => {
    const fn = flow((x: number) => x * 2);
    expect(fn(5)).toBe(10);
  });
});

// ── tap ────────────────────────────────────────────────────────────────

describe("tap", () => {
  test("executes side effect and returns value", () => {
    let sideEffect = 0;
    const result = pipe(
      42,
      tap((x) => { sideEffect = x; }),
    );
    expect(result).toBe(42);
    expect(sideEffect).toBe(42);
  });
});

describe("tapAsync", () => {
  test("executes async side effect and returns value", async () => {
    let sideEffect = 0;
    const result = await pipeAsync(
      42,
      tapAsync(async (x) => { sideEffect = x; }),
    );
    expect(result).toBe(42);
    expect(sideEffect).toBe(42);
  });
});

// ── when ───────────────────────────────────────────────────────────────

describe("when", () => {
  test("applies transform when predicate is true", () => {
    const result = pipe(5, when((x) => x > 0, (x) => x * 2));
    expect(result).toBe(10);
  });

  test("returns value unchanged when predicate is false", () => {
    const result = pipe(-5, when((x) => x > 0, (x) => x * 2));
    expect(result).toBe(-5);
  });
});

// ── branch ─────────────────────────────────────────────────────────────

describe("branch", () => {
  test("takes true branch", () => {
    const result = pipe(
      5,
      branch(
        (x) => x > 0,
        (x) => `positive: ${x}`,
        (x) => `non-positive: ${x}`,
      ),
    );
    expect(result).toBe("positive: 5");
  });

  test("takes false branch", () => {
    const result = pipe(
      -5,
      branch(
        (x) => x > 0,
        (x) => `positive: ${x}`,
        (x) => `non-positive: ${x}`,
      ),
    );
    expect(result).toBe("non-positive: -5");
  });
});

// ── tryCatch ───────────────────────────────────────────────────────────

describe("tryCatch", () => {
  test("returns result on success", () => {
    const safeParse = tryCatch(
      (s: string) => JSON.parse(s),
      (_err, raw) => ({ error: true, raw }),
    );
    expect(safeParse('{"a":1}')).toEqual({ a: 1 });
  });

  test("catches error and returns fallback", () => {
    const safeParse = tryCatch(
      (s: string) => JSON.parse(s),
      (_err, raw) => ({ error: true, raw }),
    );
    expect(safeParse("not json")).toEqual({ error: true, raw: "not json" });
  });
});

// ── map / filter / reduce ──────────────────────────────────────────────

describe("array utilities", () => {
  test("map", () => {
    const result = pipe(
      [1, 2, 3],
      map((x) => x * 2),
    );
    expect(result).toEqual([2, 4, 6]);
  });

  test("filter", () => {
    const result = pipe(
      [1, 2, 3, 4, 5],
      filter((x) => x % 2 === 0),
    );
    expect(result).toEqual([2, 4]);
  });

  test("reduce", () => {
    const result = pipe(
      [1, 2, 3, 4],
      reduce((sum, x) => sum + x, 0),
    );
    expect(result).toBe(10);
  });

  test("combined array pipeline", () => {
    const result = pipe(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      filter((x) => x % 2 === 0),
      map((x) => x * x),
      reduce((sum, x) => sum + x, 0),
    );
    expect(result).toBe(220); // 4 + 16 + 36 + 64 + 100
  });
});

// ── prop ───────────────────────────────────────────────────────────────

describe("prop", () => {
  test("extracts property", () => {
    const result = pipe(
      { name: "Alice", age: 30 },
      prop("name"),
    );
    expect(result).toBe("Alice");
  });
});

// ── identity / constant ───────────────────────────────────────────────

describe("identity and constant", () => {
  test("identity returns same value", () => {
    expect(identity(42)).toBe(42);
    expect(identity("hello")).toBe("hello");
  });

  test("constant always returns same value", () => {
    const always42 = constant(42);
    expect(always42("anything")).toBe(42);
    expect(always42(null)).toBe(42);
  });
});
