// React.memo skips a child's re-render when its props are referentially unchanged
import { useCallback, useState, memo } from 'react';
import RenderBadge from '../shared/RenderBadge';

interface Customer {
  id: number;
  name: string;
  branch: string;
}

const customers: Customer[] = [
  { id: 1, name: 'Fiona Walsh', branch: 'Cork' },
  { id: 2, name: 'Declan Murphy', branch: 'Galway' },
  { id: 3, name: 'Aoife Byrne', branch: 'Dublin' },
  { id: 4, name: "Sean O'Connor", branch: 'Limerick' },
];

function CustomerRow({ customer, onSelect }: { customer: Customer; onSelect: (id: number) => void }) {
  return (
    <tr onClick={() => onSelect(customer.id)} role="button">
      <td>{customer.name}</td>
      <td>{customer.branch}</td>
      <td>
        <RenderBadge label="renders" />
      </td>
    </tr>
  );
}

const CustomerRowMemo = memo(CustomerRow);

export default function AvoidingRerenders() {
  const [branchFilter, setBranchFilter] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [useMemoRow, setUseMemoRow] = useState(false);

  const handleSelect = useCallback((id: number) => setSelectedId(id), []);

  const visible = customers.filter((c) => c.branch.toLowerCase().includes(branchFilter.toLowerCase()));
  const Row = useMemoRow ? CustomerRowMemo : CustomerRow;

  return (
    <div className="container py-4">
      <h4>NorthBridge — Customer Search</h4>

      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="memoToggle"
          checked={useMemoRow}
          onChange={(e) => setUseMemoRow(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="memoToggle">
          Wrap row in React.memo (currently: {useMemoRow ? 'ON' : 'OFF'})
        </label>
      </div>

      <input
        className="form-control mb-3"
        placeholder="Filter by branch..."
        value={branchFilter}
        onChange={(e) => setBranchFilter(e.target.value)}
      />

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Branch</th>
            <th>Render count</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((c) => (
            <Row key={c.id} customer={c} onSelect={handleSelect} />
          ))}
        </tbody>
      </table>

      {selectedId && <p className="text-muted">Selected customer id: {selectedId}</p>}
    </div>
  );
}
