// Reconciliation matches elements by type + key. A key tied to position, not identity, misleads it.
import { useState } from 'react';

interface Txn {
  id: number;
  date: string;
  description: string;
  amount: number;
}

const initialTxns: Txn[] = [
  { id: 101, date: '28/07/2026', description: 'Payroll - Acme Ltd', amount: 3200 },
  { id: 102, date: '30/07/2026', description: 'ESB Electricity', amount: 5000 },
  { id: 103, date: '25/07/2026', description: 'Grocery - Tesco', amount: 6500 },
  { id: 104, date: '24/07/2026', description: 'Transfer to Savings', amount: 2500 },
];

function TxnRow({ txn }: { txn: Txn }) {
  const [note, setNote] = useState('');
  return (
    <tr>
      <td>{txn.date}</td>
      <td>{txn.description}</td>
      <td className={txn.amount < 0 ? 'text-danger' : 'text-success'}>€{txn.amount.toFixed(2)}</td>
      <td>
        <input
          className="form-control form-control-sm"
          placeholder="add a note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </td>
    </tr>
  );
}

export default function ReconciliationInternals() {
  const [txns, setTxns] = useState(initialTxns);
  const [useStableKey, setUseStableKey] = useState(false);

  function sortByDate() {
    setTxns((prev) => [...prev].sort((a, b) => (a.date > b.date ? -1 : 1)));
  }

  function sortByAmount() {
    setTxns((prev) => [...prev].sort((a, b) => a.amount - b.amount));
  }

  return (
    <div className="container py-4">
      <h4>NorthBridge — Recent Transactions</h4>

      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="keyToggle"
          checked={useStableKey}
          onChange={(e) => setUseStableKey(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="keyToggle">
          Use stable id as key (currently: {useStableKey ? 'txn.id' : 'array index'})
        </label>
      </div>

      <div className="d-flex gap-2 mb-3">
        <button className="btn btn-outline-secondary btn-sm" onClick={sortByDate}>
          Sort by Date
        </button>
        <button className="btn btn-outline-secondary btn-sm" onClick={sortByAmount}>
          Sort by Amount
        </button>
      </div>

      <table className="table table-bordered align-middle">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th style={{ width: '30%' }}>Note (type something, then sort)</th>
          </tr>
        </thead>
        <tbody>
          {txns.map((txn, i) => (
            <TxnRow key={useStableKey ? txn.id : i} txn={txn} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
