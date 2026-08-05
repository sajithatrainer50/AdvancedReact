import { Link } from 'react-router';

export function Menu() {
  return (
    <div>
      <h2>React Router v7 — hooks not covered elsewhere</h2>
      <p className="hint">
        Everything in Modules 1–2 was read-side: params, search params, loaders, errors. Every
        demo here is either write-side (forms, mutations) or navigation-awareness — the other half
        of what v7's data APIs actually offer.
      </p>
      <ol className="note" style={{ lineHeight: 2.2 }}>
        <li>
          <Link to="/dispute">01 useFetcher</Link> — mutate ONE row in a list without navigating away,
          with independent pending state per row.
        </li>
        <li>
          <Link to="/new-payment">02 Form + action + useActionData</Link> — a real submission with
          server-style validation, staying on the page on error, redirecting on success.
        </li>
        <li>
          <Link to="/search-payees">03 useSubmit</Link> — submit a GET navigation programmatically
          (e.g. debounced as-you-type), instead of only ever reacting to a click.
        </li>
        <li>
          <Link to="/live-balance/acc_01">04 useRevalidator</Link> — re-run the CURRENT route's loaders
          on demand, with no navigation and no URL change.
        </li>
        <li>
          <Link to="/payment-draft">05 useBlocker</Link> — stop the user leaving a page with unsaved
          changes, with a real confirm/cancel choice.
        </li>
        <li>
          <Link to="/directory">06 useMatches</Link> — read every matched route's own data at once,
          from one place — this demo's use case is breadcrumbs.
        </li>
        <li>
          <Link to="/directory">07 useRouteLoaderData</Link> — (same route tree as 06) a deeply nested
          child reads an ANCESTOR route's already-loaded data directly, no prop drilling.
        </li>
      </ol>
    </div>
  );
}
