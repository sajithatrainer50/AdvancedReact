// A visible, measurable bottleneck: filtering 5,000 records synchronously on every keystroke
import { useEffect, useState } from 'react';

interface Customer {
  id: number;
  name: string;
  iban: string;
}

const customers: Customer[] = Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  name: `Customer ${i + 1}`,
  iban: `IE29AIBK9311520${(100000 + i).toString().slice(-6)}`,
}));

function filterCustomers(query: string) {
  const q = query.toLowerCase();
  return customers.filter((c) => c.name.toLowerCase().includes(q) || c.iban.includes(query));
}

export default function PerformanceBottleneck() {
  const [instantQuery, setInstantQuery] = useState('');
  const [debouncedInput, setDebouncedInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(debouncedInput), 300);
    return () => clearTimeout(t);
  }, [debouncedInput]);

  const instantResults = filterCustomers(instantQuery);
  const debouncedResults = filterCustomers(debouncedQuery);

  return (
    <div className="container py-4">
      <h4>NorthBridge — Customer Master ({customers.length.toLocaleString()} records)</h4>

      <div className="row g-4">
        <div className="col-6">
          <label className="form-label">Instant search (filters on every keystroke)</label>
          <input
            className="form-control"
            placeholder="Search by name or IBAN..."
            value={instantQuery}
            onChange={(e) => setInstantQuery(e.target.value)}
          />
          <p className="text-muted small mt-2">{instantResults.length.toLocaleString()} matches</p>
        </div>

        <div className="col-6">
          <label className="form-label">Debounced search (waits 300ms after typing stops)</label>
          <input
            className="form-control"
            placeholder="Search by name or IBAN..."
            value={debouncedInput}
            onChange={(e) => setDebouncedInput(e.target.value)}
          />
          <p className="text-muted small mt-2">{debouncedResults.length.toLocaleString()} matches</p>
        </div>
      </div>
    </div>
  );
}
