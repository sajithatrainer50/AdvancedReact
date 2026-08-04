import { useOptimistic, useState, useTransition } from 'react';
import { generateTransactions, simulateServerCall } from '../lib/mockBank';
import type { Transaction } from '../lib/types';

// The same review workflow, this time letting React manage the optimistic state

export default function OptimisticHookDemo() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => generateTransactions(6));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [optimisticTransactions, setOptimisticFlag] = useOptimistic(
    transactions,
    (state, txnId: string) => state.map((t) => (t.id === txnId ? { ...t, flagged: !t.flagged } : t))
  );

  function toggleFlag(txn: Transaction) {
    setError(null);
    startTransition(async () => {
      setOptimisticFlag(txn.id);
      try {
        await simulateServerCall(true, { failRate: 0.35 });
        setTransactions((prev) => prev.map((t) => (t.id === txn.id ? { ...t, flagged: !t.flagged } : t)));
      } catch {
        setError(`Could not update "${txn.description}". Reverted.`);
      }
    });
  }

  return (
    <div className="container py-4">
      <h3 className="mb-3">Suspicious Activity Review — NorthBridge Ops</h3>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Flagged</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {optimisticTransactions.map((t) => (
            <tr key={t.id}>
              <td>{t.description}</td>
              <td>{t.amount.toFixed(2)}</td>
              <td>{t.flagged ? <span className="badge bg-warning text-dark">Flagged</span> : '—'}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={isPending}
                  onClick={() => toggleFlag(t)}
                >
                  {t.flagged ? 'Unflag' : 'Flag'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
