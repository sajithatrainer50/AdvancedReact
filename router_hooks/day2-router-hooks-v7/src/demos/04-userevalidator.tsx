// ┌──────────────────────────────────────────────────────────────
// │ 04-userevalidator.tsx
// │ WHAT IT OFFERS: re-running the CURRENT route's loaders on demand —
// │ no navigation, no URL change, no history entry. Different from
// │ useSubmit (which navigates) and useFetcher (which is its own
// │ isolated request) — this refreshes exactly what's already on screen.
// │
// │ BEST USE CASE: "Refresh" buttons, or reacting to a push notification/
// │ websocket message telling you server-side data changed and the
// │ current view is stale — a deposit posted elsewhere, a status update
// │ from another tab or another channel entirely.
// └──────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { useLoaderData, useRevalidator, type LoaderFunctionArgs } from 'react-router';
import { getLiveBalance } from '../data/fakeApi';

export async function liveBalanceLoader({ params }: LoaderFunctionArgs) {
  return getLiveBalance(params.id!);
}

export default function LiveBalance() {
  const { balance, asOf } = useLoaderData() as { balance: number; asOf: string };
  const revalidator = useRevalidator();
  const [pushNotified, setPushNotified] = useState(false);

  // Simulates a push notification / websocket message arriving from a
  // completely different channel — this does NOT refetch anything itself,
  // it just tells the user something changed and offers to refresh.
  useEffect(() => {
    const t = setTimeout(() => setPushNotified(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <h2>useRevalidator — refresh without navigating</h2>
      <div className="offers"><strong>Offers:</strong> re-run the loaders for the route you're ALREADY on — no URL change, no new history entry, no full navigation.</div>
      <div className="usecase"><strong>Best use case:</strong> a "Refresh" button, or responding to a push/websocket notification that server-side data changed underneath the current view.</div>

      <div className="card">
        <h3>Account acc_01 — live balance</h3>
        <span className="n">€{balance.toFixed(2)}</span>
        <p className="hint">as of {asOf}</p>
        <button
          className="ghost"
          style={{ marginTop: 10 }}
          onClick={() => revalidator.revalidate()}
          disabled={revalidator.state === 'loading'}
        >
          {revalidator.state === 'loading' ? 'refreshing…' : 'Refresh'}
        </button>
      </div>

      {pushNotified && (
        <div className="banner">
          🔔 New activity detected on this account (simulated — imagine a websocket push).{' '}
          <button className="ghost" onClick={() => { revalidator.revalidate(); setPushNotified(false); }}>
            Refresh now
          </button>
        </div>
      )}

      <p className="note">
        Click Refresh a couple of times — the balance ticks up every SECOND click (simulating a
        deposit landing from another channel while you had this open). Watch the URL bar: it never
        changes, and there's no new browser-history entry — this only ever re-runs THIS route's
        loader, in place.
      </p>
    </div>
  );
}
