import { useId, useState } from 'react';

// Generating unique, stable ids for form fields that repeat in a list

interface BeneficiaryRow {
  key: string;
}

function BeneficiaryFields() {
  const id = useId();
  return (
    <div className="row g-2 mb-2">
      <div className="col">
        <label htmlFor={`${id}-name`} className="form-label">
          Name
        </label>
        <input id={`${id}-name`} className="form-control" />
      </div>
      <div className="col">
        <label htmlFor={`${id}-iban`} className="form-label">
          IBAN
        </label>
        <input id={`${id}-iban`} className="form-control" />
      </div>
    </div>
  );
}

export default function UseIdDemo() {
  const [rows, setRows] = useState<BeneficiaryRow[]>([{ key: 'row-1' }]);

  function addRow() {
    setRows((prev) => [...prev, { key: `row-${prev.length + 1}-${Date.now()}` }]);
  }

  return (
    <div className="container py-4">
      <h3 className="mb-3">Add Beneficiaries — NexusPay</h3>
      {rows.map((row) => (
        <BeneficiaryFields key={row.key} />
      ))}
      <button className="btn btn-outline-primary" onClick={addRow}>
        Add another beneficiary
      </button>
    </div>
  );
}
