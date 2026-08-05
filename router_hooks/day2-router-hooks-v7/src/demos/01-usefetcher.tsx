// ┌──────────────────────────────────────────────────────────────
// │ 01-usefetcher.tsx
// │ WHAT IT OFFERS: a mutation that does NOT navigate anywhere, with its
// │ OWN independent pending/success state — separate from every other
// │ fetcher on the page. useNavigation() (Module 2) only tells you about
// │ the CURRENT navigation; it can't tell you "row 3's button was just
// │ clicked" while row 1 and row 2 sit idle. useFetcher() can.
// │
// │ BEST USE CASE: any list where each row can be independently mutated
// │ in place — dispute a transaction, mark a message read, toggle a
// │ favourite — without leaving the list or reloading the whole page.
// └──────────────────────────────────────────────────────────────
import { useFetcher, useLoaderData, type ActionFunctionArgs } from 'react-router';
import { getTransactions, disputeTransaction, type Txn } from '../data/fakeApi';

// ONE action, on the route itself, shared by every row's fetcher. The
// `intent` hidden field is how one action supports more than one kind of
// mutation — a common, deliberate pattern once a page has multiple buttons.
export async function transactionsAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  if (intent === 'dispute') {
    const txnId = String(formData.get('txnId'));
    return disputeTransaction(txnId);
  }
  throw new Response(`Unknown intent: ${intent}`, { status: 400 });
}

export async function transactionsLoader() {
  return getTransactions('acc_01');
}

function TransactionRow({ txn }: { txn: Txn }) {
  // Each row gets its OWN fetcher instance — this is the entire idea.
  // fetcher.state and fetcher.data below describe THIS row only.
  const fetcher = useFetcher<Txn>();

  // Optimistic read: while the submission is in flight, fetcher.formData
  // holds exactly what was submitted — we can render "disputed" immediately
  // rather than waiting for the round trip, then let the real response
  // (fetcher.data) confirm it once it lands.
  const optimisticallyDisputed = fetcher.formData?.get('txnId') === txn.id;
  const isDisputed = txn.disputed || fetcher.data?.disputed || optimisticallyDisputed;

  return (
    <tr>
      <td style={{ padding: '8px 0' }}>{txn.date} · {txn.merchant}</td>
      <td className={txn.amount < 0 ? 'bad' : 'ok'} style={{ textAlign: 'right' }}>
        {txn.amount < 0 ? '' : '+'}€{txn.amount.toFixed(2)}
      </td>
      <td style={{ textAlign: 'right' }}>
        {isDisputed ? (
          <span className="hint">✓ disputed</span>
        ) : (
          <fetcher.Form method="post">
            <input type="hidden" name="intent" value="dispute" />
            <input type="hidden" name="txnId" value={txn.id} />
            <button className="ghost" type="submit" disabled={fetcher.state !== 'idle'}>
              {fetcher.state !== 'idle' ? 'flagging…' : 'dispute'}
            </button>
          </fetcher.Form>
        )}
      </td>
    </tr>
  );
}

export default function DisputeTransactions() {
  const transactions = useLoaderData() as Txn[];
  return (
    <div>
      <h2>useFetcher — dispute a transaction in place</h2>
      <div className="offers"><strong>Offers:</strong> a mutation with its own state, scoped to ONE row — not the whole page's navigation state.</div>
      <div className="usecase"><strong>Best use case:</strong> any list where each row needs an independent in-place action — dispute, archive, mark-read, favourite.</div>

      <div className="card">
        <h3>Account acc_01 — transactions</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <tbody>
            {transactions.map((t) => <TransactionRow key={t.id} txn={t} />)}
          </tbody>
        </table>
        <p className="note">
          Click "dispute" on two different rows quickly — each shows its OWN "flagging…" state,
          independently, because each fetcher.Form is a separate fetcher instance. Nothing here
          navigates: the URL never changes, and the rest of the page is untouched.
        </p>
      </div>
    </div>
  );
}
