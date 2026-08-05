// ┌──────────────────────────────────────────────────────────────
// │ 03-usesubmit.tsx
// │ WHAT IT OFFERS: triggering a REAL navigation (loader re-run, URL/
// │ search-params update, back-button entry) programmatically — from a
// │ timer, a keystroke, anything — not only from a user clicking a
// │ submit button inside a <Form>.
// │
// │ BEST USE CASE: search-as-you-type, auto-saving a filter to the URL
// │ as the user adjusts it, or submitting from a control that isn't a
// │ native form element at all (a custom dropdown, a keyboard shortcut).
// └──────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react';
import { useLoaderData, useSubmit, type LoaderFunctionArgs } from 'react-router';
import { searchPayees } from '../data/fakeApi';

export async function searchPayeesLoader({ request }: LoaderFunctionArgs) {
  const q = new URL(request.url).searchParams.get('q') ?? '';
  const results = await searchPayees(q);
  return { q, results };
}

export default function SearchPayees() {
  const { q, results } = useLoaderData() as { q: string; results: string[] };
  const submit = useSubmit();
  const [draft, setDraft] = useState(q);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced auto-submit: every keystroke resets a 300ms timer. Only once
  // typing PAUSES does this actually call submit() — which triggers a real
  // GET navigation to ?q=..., re-running searchPayeesLoader above.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      submit({ q: draft }, { method: 'get', replace: true });
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  return (
    <div>
      <h2>useSubmit — debounced search-as-you-type</h2>
      <div className="offers"><strong>Offers:</strong> a programmatic, real navigation — not a manual setSearchParams call — triggered by something other than a form's submit button.</div>
      <div className="usecase"><strong>Best use case:</strong> search-as-you-type, auto-saving filters to the URL, or submitting from a non-native control (custom dropdown, keyboard shortcut).</div>

      <div className="card">
        <h3>Search payees</h3>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="type to filter…" />
        <p className="hint" style={{ marginTop: 8 }}>
          Current URL search param: <code className="mono">?q={q || '(empty)'}</code>
        </p>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: 10 }}>
          {results.map((p) => <li key={p} style={{ padding: '5px 0', borderBottom: '1px solid var(--line)' }}>{p}</li>)}
        </ul>
        <p className="note">
          Notice the URL bar updates ~300ms after you stop typing — that's the loader re-running
          via a REAL navigation, not a client-side filter. replace: true means each keystroke's
          result doesn't clutter the back-button history with one entry per letter.
        </p>
      </div>
    </div>
  );
}
