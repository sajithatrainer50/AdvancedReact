import { useDeferredValue, useMemo, useState } from 'react';
import { computeRiskScore, generateTransactions } from '../lib/mockBank';

// Letting an expensive list lag one step behind the latest keystroke

const CATALOG = generateTransactions(4000);

export default function DeferredValueDemo() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  const results = useMemo(() => {
    return CATALOG.filter((t) => t.description.toLowerCase().includes(deferredQuery.toLowerCase()))
      .slice(0, 300)
      .map((t) => ({ ...t, risk: computeRiskScore(t.amount + t.id.length) }));
  }, [deferredQuery]);

  return (
    <div className="container py-4">
      <h3 className="mb-3">NexusPay Merchant Catalogue</h3>
      <input
        className="form-control mb-3"
        placeholder="Search merchant"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="table-responsive" style={{ opacity: isStale ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Merchant</th>
              <th>Amount</th>
              <th>Risk score</th>
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
    </div>
  );
}
