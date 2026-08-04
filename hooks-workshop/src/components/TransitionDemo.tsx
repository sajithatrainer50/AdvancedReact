import { useMemo, useState, useTransition } from 'react';
import { computeRiskScore, generateTransactions } from '../lib/mockBank';

// Keeping typing responsive while a big list re-renders in the background

const ALL_TRANSACTIONS = generateTransactions(5000);

export default function TransitionDemo() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [isPending, startTransition] = useTransition();

  const results = useMemo(() => {
    return ALL_TRANSACTIONS.filter((t) => t.description.toLowerCase().includes(filter.toLowerCase()))
      .slice(0, 300)
      .map((t) => ({ ...t, risk: computeRiskScore(t.amount + t.id.length) }));
  }, [filter]);

  function handleChange(value: string) {
    setQuery(value);
   
    startTransition(() => {
      setFilter(value);
    });
  }

  return (
    <div className="container py-4">
      <h3 className="mb-3">NexusPay Ledger Search</h3>
      <input
        className="form-control mb-3"
        placeholder="Search merchant, e.g. Tesco"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
      />
      <div className="text-muted mb-2" style={{ minHeight: 24 }}>
        {isPending && 'Refreshing results…'}
      </div>
      <div className="table-responsive" style={{ opacity: isPending ? 0.6 : 1 }}>
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
