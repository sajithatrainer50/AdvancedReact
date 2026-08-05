// ┌──────────────────────────────────────────────────────────────
// │ 06-usematches.tsx
// │ WHAT IT OFFERS: reading EVERY currently-matched route's own data —
// │ params, loaderData, and a custom `handle` — from ONE place, in one
// │ call, regardless of how deeply nested the current URL is.
// │
// │ BEST USE CASE: breadcrumbs. Each route declares its own small piece
// │ of "what am I called" via `handle`; a single layout-level component
// │ assembles the full trail without needing to know the tree's shape.
// │
// │ Shares its route tree with 07-userouteloaderdata.tsx — see router.tsx.
// └──────────────────────────────────────────────────────────────
import { Outlet, useMatches, Link } from 'react-router';
import type { Account } from '../data/fakeApi';

// A route's `handle` is arbitrary data YOU attach — React Router doesn't
// interpret it at all, it just hands it back to you via useMatches().
// Here, `crumb` is either a plain string, or a function that computes the
// label from that route's own loaderData (e.g. the account holder's name).
type Crumb = string | ((data: unknown) => string);
type Handle = { crumb: Crumb };

function Breadcrumbs() {
  const matches = useMatches();
  const crumbs = matches
    .filter((m): m is typeof m & { handle: Handle } => Boolean((m.handle as Handle | undefined)?.crumb))
    .map((m) => {
      const { crumb } = m.handle as Handle;
      const label = typeof crumb === 'function' ? crumb(m.data as Account) : crumb;
      return { label, pathname: m.pathname };
    });

  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {crumbs.map((c, i) => (
        <span key={c.pathname}>
          {i > 0 && ' / '}
          {i === crumbs.length - 1 ? c.label : <Link to={c.pathname}>{c.label}</Link>}
        </span>
      ))}
    </nav>
  );
}

export function DirectoryLayout() {
  return (
    <div>
      <h2>useMatches — breadcrumbs from the whole matched tree</h2>
      <div className="offers"><strong>Offers:</strong> every currently-matched route's params, loaderData, and custom handle, in ONE array — not just the deepest one.</div>
      <div className="usecase"><strong>Best use case:</strong> breadcrumbs, page titles, or any layout-level UI that needs to know about the whole matched route tree without being told its shape.</div>
      <Breadcrumbs />
      <Outlet />
    </div>
  );
}

export function DirectoryHome() {
  return (
    <div className="card">
      <h3>Directory</h3>
      <p className="note">Pick an account below (07's demo continues from here):</p>
      <div className="row">
        <Link to="/directory/accounts/acc_01"><button className="ghost">acc_01</button></Link>
        <Link to="/directory/accounts/acc_02"><button className="ghost">acc_02</button></Link>
        <Link to="/directory/accounts/acc_03"><button className="ghost">acc_03</button></Link>
      </div>
    </div>
  );
}
