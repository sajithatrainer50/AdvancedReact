import { create } from 'zustand';

// ─────────────────────────────────────────────────────────────
// STEP 1: Describe the shape of your state + actions as one type.
// There is no separation between "state" and "actions" in Zustand.
// Functions that update state live in the SAME object as the data.
// ─────────────────────────────────────────────────────────────
type CounterState = {
  count: number;
  increment: () => void;
  decrement: () => void;
  incrementBy: (amount: number) => void;
  reset: () => void;
};

// ─────────────────────────────────────────────────────────────
// STEP 2: Call create<T>()(initializer) to build the store.
//
// Why the double parentheses create<T>()(...) instead of create<T>(...)?
// This is a TypeScript-only workaround called "curried create".
// It exists purely so TS can infer middleware types correctly later
// (e.g. when you add persist() or devtools()). For a plain store like
// this one it has ZERO runtime effect — it's just how v5 recommends
// you write it when you pass an explicit generic.
//
// The initializer function receives THREE arguments: (set, get, api)
//   - set  → the ONLY way to update state and trigger re-renders
//   - get  → reads the CURRENT state at call time (not stale/closed-over)
//   - api  → the raw store object itself (rarely needed directly)
// We only use set and get below — api is included in the comment
// so you know it exists.
// ─────────────────────────────────────────────────────────────
export const useCounterStore = create<CounterState>()((set, get) => ({
  // Initial state. This runs ONCE, when the module first loads.
  count: 0,

  // REAL PATTERN: functional update.
  // set() can take an updater function: (currentState) => partialState.
  // Zustand calls this with the LATEST state, so it's always safe even
  // if increment() fires multiple times in a row before a re-render.
  increment: () => set((state) => ({ count: state.count + 1 })),

  decrement: () => set((state) => ({ count: state.count - 1 })),

  // REAL PATTERN: using get() inside an action.
  // get() lets an action read state WITHOUT subscribing to it —
  // it's a plain synchronous read, not a hook. Useful when you need
  // the current value to compute something before calling set().
  incrementBy: (amount) => {
    const current = get().count;
    set({ count: current + amount });
  },

  // SHORTCUT: set({ count: 0 }) — a plain object instead of a function.
  // This is fine ONLY when the new value does NOT depend on the old one.
  // set() shallow-MERGES this object into existing state by default —
  // any other keys (increment, decrement, etc.) are left untouched.
  reset: () => set({ count: 0 }),
}));
