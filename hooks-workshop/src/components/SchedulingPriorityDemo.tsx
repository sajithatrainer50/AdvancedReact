import { useDeferredValue, useMemo, useState, useTransition } from 'react';
import { computeRiskScore, generateTransactions } from '../lib/mockBank';

// Comparing the two ways React lets an update say "I can wait"

const RECORDS = generateTransactions(5000);
type Mode = 'immediate' | 'transition' | 'deferred';

function useFilteredRecords(term: string) {
  return useMemo(() => {
    return RECORDS.filter((t) => t.description.toLowerCase().includes(term.toLowerCase()))
      .slice(0, 300)
      .map((t) => ({ ...t, risk: computeRiskScore(t.amount + t.id.length) }));
  }, [term]);
}

export default function SchedulingPriorityDemo() {
  const [mode, setMode] = useState<Mode>('immediate');
  const [input, setInput] = useState('');
  const [committed, setCommitted] = useState('');
  const [isPending, startTransition] = useTransition();
  const deferredInput = useDeferredValue(input);

  const term = mode === 'immediate' ? input : mode === 'transition' ? committed : deferredInput;
  const results = useFilteredRecords(term);
  const isStale = mode === 'deferred' && input !== deferredInput;

  function handleChange(value: string) {
    setInput(value);
    if (mode === 'transition') {
      startTransition(() => setCommitted(value));
    }
  }

  function handleModeChange(next: Mode) {
    setMode(next);
    setInput('');
    setCommitted('');
  }

  return (
    <div className="container py-4">
      <h3 className="mb-3">Compliance Search — Priority Modes</h3>
      <div className="btn-group mb-3">
        <button
          className={`btn btn-outline-secondary ${mode === 'immediate' ? 'active' : ''}`}
          onClick={() => handleModeChange('immediate')}
        >
          Immediate
        </button>
        <button
          className={`btn btn-outline-secondary ${mode === 'transition' ? 'active' : ''}`}
          onClick={() => handleModeChange('transition')}
        >
          useTransition
        </button>
        <button
          className={`btn btn-outline-secondary ${mode === 'deferred' ? 'active' : ''}`}
          onClick={() => handleModeChange('deferred')}
        >
          useDeferredValue
        </button>
      </div>

      <input
        className="form-control mb-2"
        placeholder="Type to search…"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
      <div className="text-muted mb-2" style={{ minHeight: 24 }}>
        {mode === 'transition' && isPending && 'React is deferring this render…'}
        {mode === 'deferred' && isStale && 'Showing slightly stale results…'}
      </div>

      <table className="table table-sm">
        <thead>
          <tr>
            <th>Merchant</th>
            <th>Amount</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          {results.map((t) => (
            <tr key={t.id}>
              <td>{t.description}</td>
              <td>{t.amount.toFixed(2)}</td>
              <td>{t.risk}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
