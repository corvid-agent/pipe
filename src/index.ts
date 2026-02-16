/**
 * @corvid-agent/pipe
 *
 * Functional pipe and compose with full TypeScript type inference.
 * Supports sync/async, error handling, tap/filter, and branching.
 * Zero dependencies.
 */

// ── Types ──────────────────────────────────────────────────────────────

type Fn<A = any, B = any> = (a: A) => B;
type AsyncFn<A = any, B = any> = (a: A) => B | Promise<B>;

// ── pipe() — left-to-right composition ─────────────────────────────────

/**
 * Pipe a value through a series of functions, left to right.
 *
 * @example
 * ```ts
 * import { pipe } from "@corvid-agent/pipe";
 *
 * const result = pipe(
 *   5,
 *   (x) => x * 2,
 *   (x) => x + 1,
 *   (x) => `Result: ${x}`,
 * );
 * // "Result: 11"
 * ```
 */
export function pipe<A>(value: A): A;
export function pipe<A, B>(value: A, f1: Fn<A, B>): B;
export function pipe<A, B, C>(value: A, f1: Fn<A, B>, f2: Fn<B, C>): C;
export function pipe<A, B, C, D>(value: A, f1: Fn<A, B>, f2: Fn<B, C>, f3: Fn<C, D>): D;
export function pipe<A, B, C, D, E>(value: A, f1: Fn<A, B>, f2: Fn<B, C>, f3: Fn<C, D>, f4: Fn<D, E>): E;
export function pipe<A, B, C, D, E, F>(value: A, f1: Fn<A, B>, f2: Fn<B, C>, f3: Fn<C, D>, f4: Fn<D, E>, f5: Fn<E, F>): F;
export function pipe<A, B, C, D, E, F, G>(value: A, f1: Fn<A, B>, f2: Fn<B, C>, f3: Fn<C, D>, f4: Fn<D, E>, f5: Fn<E, F>, f6: Fn<F, G>): G;
export function pipe<A, B, C, D, E, F, G, H>(value: A, f1: Fn<A, B>, f2: Fn<B, C>, f3: Fn<C, D>, f4: Fn<D, E>, f5: Fn<E, F>, f6: Fn<F, G>, f7: Fn<G, H>): H;
export function pipe<A, B, C, D, E, F, G, H, I>(value: A, f1: Fn<A, B>, f2: Fn<B, C>, f3: Fn<C, D>, f4: Fn<D, E>, f5: Fn<E, F>, f6: Fn<F, G>, f7: Fn<G, H>, f8: Fn<H, I>): I;
export function pipe<A, B, C, D, E, F, G, H, I, J>(value: A, f1: Fn<A, B>, f2: Fn<B, C>, f3: Fn<C, D>, f4: Fn<D, E>, f5: Fn<E, F>, f6: Fn<F, G>, f7: Fn<G, H>, f8: Fn<H, I>, f9: Fn<I, J>): J;
export function pipe(value: unknown, ...fns: Fn[]): unknown {
  return fns.reduce((acc, fn) => fn(acc), value);
}

// ── pipeAsync() — async left-to-right composition ──────────────────────

/**
 * Pipe a value through async functions, left to right.
 * Each function can be sync or async.
 *
 * @example
 * ```ts
 * const result = await pipeAsync(
 *   userId,
 *   fetchUser,
 *   (user) => user.email,
 *   sendWelcomeEmail,
 * );
 * ```
 */
export function pipeAsync<A>(value: A): Promise<A>;
export function pipeAsync<A, B>(value: A, f1: AsyncFn<A, B>): Promise<B>;
export function pipeAsync<A, B, C>(value: A, f1: AsyncFn<A, B>, f2: AsyncFn<B, C>): Promise<C>;
export function pipeAsync<A, B, C, D>(value: A, f1: AsyncFn<A, B>, f2: AsyncFn<B, C>, f3: AsyncFn<C, D>): Promise<D>;
export function pipeAsync<A, B, C, D, E>(value: A, f1: AsyncFn<A, B>, f2: AsyncFn<B, C>, f3: AsyncFn<C, D>, f4: AsyncFn<D, E>): Promise<E>;
export function pipeAsync<A, B, C, D, E, F>(value: A, f1: AsyncFn<A, B>, f2: AsyncFn<B, C>, f3: AsyncFn<C, D>, f4: AsyncFn<D, E>, f5: AsyncFn<E, F>): Promise<F>;
export function pipeAsync<A, B, C, D, E, F, G>(value: A, f1: AsyncFn<A, B>, f2: AsyncFn<B, C>, f3: AsyncFn<C, D>, f4: AsyncFn<D, E>, f5: AsyncFn<E, F>, f6: AsyncFn<F, G>): Promise<G>;
export function pipeAsync(value: unknown, ...fns: AsyncFn[]): Promise<unknown> {
  return fns.reduce<Promise<unknown>>(
    async (acc, fn) => fn(await acc),
    Promise.resolve(value),
  );
}

// ── compose() — right-to-left composition ──────────────────────────────

/**
 * Compose functions right-to-left (mathematical composition).
 * Returns a new function.
 *
 * @example
 * ```ts
 * const transform = compose(
 *   (x: number) => `Result: ${x}`,
 *   (x: number) => x + 1,
 *   (x: number) => x * 2,
 * );
 * transform(5); // "Result: 11"
 * ```
 */
export function compose<A, B>(f1: Fn<A, B>): Fn<A, B>;
export function compose<A, B, C>(f2: Fn<B, C>, f1: Fn<A, B>): Fn<A, C>;
export function compose<A, B, C, D>(f3: Fn<C, D>, f2: Fn<B, C>, f1: Fn<A, B>): Fn<A, D>;
export function compose<A, B, C, D, E>(f4: Fn<D, E>, f3: Fn<C, D>, f2: Fn<B, C>, f1: Fn<A, B>): Fn<A, E>;
export function compose<A, B, C, D, E, F>(f5: Fn<E, F>, f4: Fn<D, E>, f3: Fn<C, D>, f2: Fn<B, C>, f1: Fn<A, B>): Fn<A, F>;
export function compose(...fns: Fn[]): Fn {
  return (value: unknown) => fns.reduceRight((acc, fn) => fn(acc), value);
}

// ── flow() — left-to-right function composition ────────────────────────

/**
 * Create a pipeline function (left-to-right composition).
 * Like compose, but reads naturally left-to-right.
 *
 * @example
 * ```ts
 * const process = flow(
 *   (x: number) => x * 2,
 *   (x) => x + 1,
 *   (x) => `Result: ${x}`,
 * );
 * process(5); // "Result: 11"
 * ```
 */
export function flow<A, B>(f1: Fn<A, B>): Fn<A, B>;
export function flow<A, B, C>(f1: Fn<A, B>, f2: Fn<B, C>): Fn<A, C>;
export function flow<A, B, C, D>(f1: Fn<A, B>, f2: Fn<B, C>, f3: Fn<C, D>): Fn<A, D>;
export function flow<A, B, C, D, E>(f1: Fn<A, B>, f2: Fn<B, C>, f3: Fn<C, D>, f4: Fn<D, E>): Fn<A, E>;
export function flow<A, B, C, D, E, F>(f1: Fn<A, B>, f2: Fn<B, C>, f3: Fn<C, D>, f4: Fn<D, E>, f5: Fn<E, F>): Fn<A, F>;
export function flow<A, B, C, D, E, F, G>(f1: Fn<A, B>, f2: Fn<B, C>, f3: Fn<C, D>, f4: Fn<D, E>, f5: Fn<E, F>, f6: Fn<F, G>): Fn<A, G>;
export function flow<A, B, C, D, E, F, G, H>(f1: Fn<A, B>, f2: Fn<B, C>, f3: Fn<C, D>, f4: Fn<D, E>, f5: Fn<E, F>, f6: Fn<F, G>, f7: Fn<G, H>): Fn<A, H>;
export function flow(...fns: Fn[]): Fn {
  return (value: unknown) => fns.reduce((acc, fn) => fn(acc), value);
}

// ── Utilities ──────────────────────────────────────────────────────────

/**
 * Execute a side effect without modifying the value.
 * Useful for logging in pipelines.
 *
 * @example
 * ```ts
 * pipe(
 *   data,
 *   transform,
 *   tap(console.log),  // logs the intermediate value
 *   format,
 * );
 * ```
 */
export function tap<T>(fn: (value: T) => void): Fn<T, T> {
  return (value: T) => {
    fn(value);
    return value;
  };
}

/**
 * Async tap — side effect that might be async.
 */
export function tapAsync<T>(fn: (value: T) => void | Promise<void>): AsyncFn<T, T> {
  return async (value: T) => {
    await fn(value);
    return value;
  };
}

/**
 * Conditionally apply a transform.
 *
 * @example
 * ```ts
 * pipe(
 *   value,
 *   when(x => x > 0, x => x * 2),
 * );
 * ```
 */
export function when<T>(
  predicate: (value: T) => boolean,
  transform: Fn<T, T>,
): Fn<T, T> {
  return (value: T) => predicate(value) ? transform(value) : value;
}

/**
 * Apply different transforms based on a condition.
 *
 * @example
 * ```ts
 * pipe(
 *   value,
 *   branch(
 *     x => x > 0,
 *     x => `positive: ${x}`,
 *     x => `non-positive: ${x}`,
 *   ),
 * );
 * ```
 */
export function branch<T, A, B>(
  predicate: (value: T) => boolean,
  ifTrue: Fn<T, A>,
  ifFalse: Fn<T, B>,
): Fn<T, A | B> {
  return (value: T) => predicate(value) ? ifTrue(value) : ifFalse(value);
}

/**
 * Try a transform, falling back to a handler on error.
 *
 * @example
 * ```ts
 * pipe(
 *   input,
 *   tryCatch(
 *     JSON.parse,
 *     (err, input) => ({ error: true, raw: input }),
 *   ),
 * );
 * ```
 */
export function tryCatch<T, R, E = R>(
  fn: Fn<T, R>,
  onError: (error: unknown, value: T) => E,
): Fn<T, R | E> {
  return (value: T) => {
    try {
      return fn(value);
    } catch (error) {
      return onError(error, value);
    }
  };
}

/**
 * Map over an array in a pipeline.
 *
 * @example
 * ```ts
 * pipe(
 *   [1, 2, 3],
 *   map(x => x * 2),
 * );
 * // [2, 4, 6]
 * ```
 */
export function map<T, R>(fn: Fn<T, R>): Fn<T[], R[]> {
  return (arr: T[]) => arr.map(fn);
}

/**
 * Filter an array in a pipeline.
 *
 * @example
 * ```ts
 * pipe(
 *   [1, 2, 3, 4, 5],
 *   filter(x => x % 2 === 0),
 * );
 * // [2, 4]
 * ```
 */
export function filter<T>(predicate: (value: T) => boolean): Fn<T[], T[]> {
  return (arr: T[]) => arr.filter(predicate);
}

/**
 * Reduce an array in a pipeline.
 */
export function reduce<T, R>(fn: (acc: R, value: T) => R, initial: R): Fn<T[], R> {
  return (arr: T[]) => arr.reduce(fn, initial);
}

/**
 * Property accessor for pipelines.
 *
 * @example
 * ```ts
 * pipe(
 *   { name: "Alice", age: 30 },
 *   prop("name"),
 * );
 * // "Alice"
 * ```
 */
export function prop<T, K extends keyof T>(key: K): Fn<T, T[K]> {
  return (obj: T) => obj[key];
}

/**
 * Identity function — returns the value unchanged.
 */
export function identity<T>(value: T): T {
  return value;
}

/**
 * Create a constant function.
 */
export function constant<T>(value: T): Fn<unknown, T> {
  return () => value;
}
