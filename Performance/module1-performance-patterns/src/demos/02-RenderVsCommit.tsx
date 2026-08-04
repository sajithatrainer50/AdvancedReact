// Automatic batching (React 18+): several setState calls can collapse into one render + one commit
import { useState } from 'react';

export default function RenderVsCommit() {
  const [balance, setBalance] = useState(12500);
  const [interest, setInterest] = useState(310.5);
  const [fees, setFees] = useState(12);
  const [renders, setRenders] = useState(0);

  console.log('%cRender fired', 'color: #0d6efd', new Date().toISOString());

  function refreshInClickHandler() {
    setBalance((b) => b + 25);
    setInterest((i) => i + 1.2);
    setFees((f) => f + 0.5);
    setRenders((r) => r + 1);
  }

  function refreshInSetTimeout() {
    setTimeout(() => {
      setBalance((b) => b + 25);
      setInterest((i) => i + 1.2);
      setFees((f) => f + 0.5);
      setRenders((r) => r + 1);
    }, 0);
  }

  return (
    <div className="container py-4">
      <h4>NorthBridge — Statement Refresh</h4>

      <div className="row g-3 mb-4">
        <div className="col-4">
          <div className="card p-3">
            <small className="text-muted">Balance</small>
            <h5>€{balance.toFixed(2)}</h5>
          </div>
        </div>
        <div className="col-4">
          <div className="card p-3">
            <small className="text-muted">Interest MTD</small>
            <h5>€{interest.toFixed(2)}</h5>
          </div>
        </div>
        <div className="col-4">
          <div className="card p-3">
            <small className="text-muted">Fees MTD</small>
            <h5>€{fees.toFixed(2)}</h5>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 mb-2">
        <button className="btn btn-primary" onClick={refreshInClickHandler}>
          Refresh (click handler)
        </button>
        <button className="btn btn-outline-primary" onClick={refreshInSetTimeout}>
          Refresh (setTimeout)
        </button>
      </div>

      <p className="text-muted small mb-0">Refresh count: {renders}</p>
      <p className="text-muted small">Open the Console. Compare how many "Render fired" lines print per click, for each button.</p>
    </div>
  );
}
