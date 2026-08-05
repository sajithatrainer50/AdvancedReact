// ┌──────────────────────────────────────────────────────────────
// │ 05-useblocker.tsx
// │ WHAT IT OFFERS: genuinely stopping a navigation mid-flight and asking
// │ the user to confirm — not a browser beforeunload popup (which only
// │ fires on tab-close/reload), but React Router's own in-app navigation
// │ (clicking a nav link, calling navigate()) being paused until the user
// │ decides.
// │
// │ BEST USE CASE: any form with meaningfully unsaved input — a payment
// │ draft, a KYC step, an edited profile — where silently discarding
// │ the user's typing on an accidental nav click would be a real loss.
// └──────────────────────────────────────────────────────────────
import { useState } from 'react';
import { useBlocker } from 'react-router';

export default function PaymentDraft() {
  const [payee, setPayee] = useState('');
  const [amount, setAmount] = useState('');
  const isDirty = payee.trim() !== '' || amount.trim() !== '';

  // The blocker function receives the CURRENT and NEXT location. Returning
  // true pauses the navigation; false lets it proceed untouched. We only
  // block when there's actually something to lose AND we're truly leaving
  // this route (not, say, submitting the form itself).
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => isDirty && currentLocation.pathname !== nextLocation.pathname,
  );

  return (
    <div>
      <h2>useBlocker — guard against losing unsaved input</h2>
      <div className="offers"><strong>Offers:</strong> pausing a REAL in-app navigation (nav link, navigate()) until the user confirms — not just a browser tab-close warning.</div>
      <div className="usecase"><strong>Best use case:</strong> any form with meaningful unsaved input — a payment draft, a KYC step, an edited profile — where an accidental click shouldn't silently discard it.</div>

      <div className="card">
        <h3>Draft a payment (not yet submitted)</h3>
        <div className="field">
          <label htmlFor="d-payee">Payee</label>
          <input id="d-payee" value={payee} onChange={(e) => setPayee(e.target.value)} placeholder="type something…" />
        </div>
        <div className="field">
          <label htmlFor="d-amount">Amount</label>
          <input id="d-amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="type something…" />
        </div>
        <p className="hint">{isDirty ? '● unsaved changes' : 'no changes yet — try the nav rail freely'}</p>
      </div>

      {blocker.state === 'blocked' && (
        <div className="banner">
          <strong>You have unsaved changes.</strong> Leave this page anyway?
          <div className="row" style={{ marginTop: 10 }}>
            <button onClick={() => blocker.proceed()}>Leave without saving</button>
            <button className="ghost" onClick={() => blocker.reset()}>Stay on this page</button>
          </div>
        </div>
      )}

      <p className="note">
        Type something in either field, then click any link in the nav rail — the navigation
        pauses right here instead of happening immediately. blocker.proceed() lets it continue;
        blocker.reset() cancels it and you stay put. With both fields empty, the same nav click
        goes through with no interruption at all.
      </p>
    </div>
  );
}
