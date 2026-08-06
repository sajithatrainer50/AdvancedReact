import { useState } from 'react';
import { useCounterStore } from '../stores/useCounterStore';

// This renders every time ANY part of CounterPage's state changes,
// so we can see in the console when it re-renders vs. when it doesn't.
function RenderLog({ label }: { label: string }) {
  console.log(`%c${label} rendered`, 'color: #2e7d32');
  return null;
}

export function CounterPage() {
  // ───────────────────────────────────────────────────────────
  // REAL PATTERN: selecting a SLICE of state.
  // useCounterStore is the hook. Called with a selector function,
  // it subscribes THIS component only to `count`. If some other
  // field existed on the store and changed, this component would
  // NOT re-render, because the selector's return value didn't change.
  // This is the whole reason Zustand avoids the "one big context
  // re-renders everything" problem.
  // ───────────────────────────────────────────────────────────
  const count = useCounterStore((state) => state.count);

  // Actions are also read via selectors. Selecting a function is safe —
  // functions defined in create() are stable across renders (Zustand
  // does not recreate them), so this never causes extra re-renders.
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const incrementBy = useCounterStore((state) => state.incrementBy);
  const reset = useCounterStore((state) => state.reset);

  const [step, setStep] = useState(5);

  return (
    <section className="page">
      <h2>Counter — the minimal Zustand store</h2>
      <p className="count-display">{count}</p>

      <div className="button-row">
        <button onClick={decrement}>− 1</button>
        <button onClick={increment}>+ 1</button>
        <button onClick={() => incrementBy(step)}>+ {step}</button>
        <button onClick={reset} className="secondary">
          Reset
        </button>
      </div>

      <label className="step-control">
        Step size for "+ {step}":
        <input
          type="number"
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
        />
      </label>

      <RenderLog label="CounterPage" />

      <p className="hint">
        Open the console. Every click logs a render. Notice this
        component only cares about <code>count</code> — selecting a
        narrower slice is what keeps unrelated components from
        re-rendering in a bigger app.
      </p>
    </section>
  );
}
