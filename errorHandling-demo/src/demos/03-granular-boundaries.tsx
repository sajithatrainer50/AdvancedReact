// ┌──────────────────────────────────────────────────────────────
// │ Error Handling · 03-granular-boundaries.tsx
// │ ONE IDEA: WHERE you place a boundary decides how much UI dies.
// │           One boundary at the top = whole app blanks. One per
// │           widget = only the broken widget shows a fallback.
// └──────────────────────────────────────────────────────────────
import { useState } from 'react';
import { ErrorBoundary } from '../lib/ErrorBoundary';

function Widget({ label }: { label: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) throw new Error(`${label} crashed`);
  return (
    <div style={{ border: '1px solid #e3e4e0', borderRadius: 8, padding: 14, flex: 1 }}>
      <span className="lbl">{label}</span>
      <div style={{ marginTop: 8 }}>
        <button className="ghost" onClick={() => setBroken(true)}>break this widget</button>
      </div>
    </div>
  );
}

const fallback = (label: string) => (err: Error, reset: () => void) => (
  <div style={{ border: '1px solid #c2410c', borderRadius: 8, padding: 14, flex: 1, background: '#fef7f6' }}>
    <strong className="bad">{label} unavailable</strong>
    <div style={{ marginTop: 8 }}><button onClick={reset}>retry</button></div>
  </div>
);

export default function GranularBoundaries() {
  return (
    <div className="card">
      <h3>Break one widget. The dashboard around it keeps working.</h3>
      <div className="row" style={{ gap: 12, alignItems: 'stretch' }}>
        {/* Each widget has its OWN boundary. A crash is contained to one.  */}
         <ErrorBoundary fallback={fallback('Balance')}><Widget label="Balance" /></ErrorBoundary>
        <ErrorBoundary fallback={fallback('Transactions')}><Widget label="Transactions" /></ErrorBoundary>
        <ErrorBoundary fallback={fallback('Payments')}><Widget label="Payments" /></ErrorBoundary>

        {/* <ErrorBoundary  fallback={fallback('Balance')}>
          <Widget  label="Balance"/>
                    <Widget  label="Transactions"/>

          <Widget  label="BalPaymentse"/>

          </ErrorBoundary> */}
      </div>
      <p className="note">
        This is “fallback UI architecture”: boundaries are not just a safety net, they are a
        <strong> layout decision</strong>. A boundary wrapping the whole app means any single crash
        blanks everything. A boundary per widget means a failing transactions feed leaves the balance
        and payments fully usable. In a banking dashboard, that difference is the product.
      </p>
    </div>
  );
}
