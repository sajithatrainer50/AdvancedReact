// ┌──────────────────────────────────────────────────────────────
// │ 07-userouteloaderdata.tsx
// │ WHAT IT OFFERS: reading an ANCESTOR route's already-loaded data,
// │ directly, from a deeply nested descendant — by that ancestor's route
// │ `id`, not by receiving it as a prop or through Outlet context.
// │
// │ BEST USE CASE: any deeply nested route (a wizard step, a detail tab)
// │ that needs data a PARENT route already fetched — the account, the
// │ application, the case file — without every layer in between having
// │ to explicitly forward it via context or props.
// │
// │ Shares its route tree with 06-usematches.tsx — see router.tsx.
// │ AccountPage is the parent (id: 'account'); TransactionsPage is the
// │ child that reads it back out with useRouteLoaderData('account').
// └──────────────────────────────────────────────────────────────
import { Link, Outlet, useLoaderData, useRouteLoaderData, type LoaderFunctionArgs } from 'react-router';
import { getAccountForDirectory, getTransactions, type Account, type Txn } from '../data/fakeApi';

export async function accountPageLoader({ params }: LoaderFunctionArgs): Promise<Account> {
  return getAccountForDirectory(params.id!);
}

// The PARENT route. Its own loader fetches the account ONCE; the child
// (TransactionsPage) will read this same data back out below, without
// AccountPage needing to pass anything down explicitly.
export function AccountPage() {
  const account = useLoaderData() as Account;
  return (
    <div className="card">
      <div className="offers"><strong>07 useRouteLoaderData offers:</strong> a descendant route reading an ANCESTOR's already-loaded data directly, by route id — no prop drilling, no re-fetch.</div>
      <div className="usecase"><strong>Best use case:</strong> a deeply nested step (wizard, detail tab) needing data a parent already fetched — the account, the case file, the application.</div>
      <h3>{account.holder}</h3>
      <p className="mono">{account.iban} · €{account.balance.toFixed(2)} · {account.type}</p>
      <Link to="transactions" className="hint">→ view transactions (07's demo continues here)</Link>
      <Outlet />
    </div>
  );
}

// The CHILD's own loader fetches only what IT is responsible for
// (transactions) — consistent with Module 2's "a loader, not useEffect"
// lesson. It does NOT re-fetch the account; that's the whole point below.
export async function transactionsForAccountLoader({ params }: LoaderFunctionArgs): Promise<Txn[]> {
  return getTransactions(params.id!);
}

// The deeply nested CHILD. Notice it has NO loader of its own for the
// account, and AccountPage never passed it a prop — it reaches straight
// up the tree for data a PARENT already fetched.
export function TransactionsPage() {
  const transactions = useLoaderData() as Txn[];
  // 'account' here is the route `id` string given to the parent route in
  // router.tsx — NOT a component name and NOT the account's own id field.
  // It's how useRouteLoaderData knows WHICH ancestor's data to hand back.
  const account = useRouteLoaderData('account') as Account;

  return (
    <div style={{ marginTop: 12, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
      <p className="hint">
        Account holder shown below came from AccountPage's loader — read here via
        useRouteLoaderData('account'), not passed as a prop, and not re-fetched:
      </p>
      <p><strong>{account.holder}</strong>'s transactions</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {transactions.map((t) => (
          <li key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13 }}>
            <span>{t.date} · {t.merchant}</span>
            <span className={t.amount < 0 ? 'bad' : 'ok'}>{t.amount < 0 ? '' : '+'}€{t.amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
