// ┌──────────────────────────────────────────────────────────────
// │ Router Hooks v7 · data/fakeApi.ts
// │ Shared fake API for all seven demos. Same NorthBridge accounts
// │ used throughout the workshop, extended with the operations these
// │ hooks specifically need: a mutation with per-row state (useFetcher),
// │ a validated write (Form/action), a searchable list (useSubmit), a
// │ value that changes server-side over time (useRevalidator).
// └──────────────────────────────────────────────────────────────
export type Account = { id: string; holder: string; iban: string; balance: number; type: string };
export type Txn = { id: string; accountId: string; merchant: string; amount: number; date: string; disputed: boolean };

const ACCOUNTS: Account[] = [
  { id: 'acc_01', holder: 'Aoife Byrne',   iban: 'IE29 AIBK …78', balance: 4182.66,  type: 'Operating' },
  { id: 'acc_02', holder: 'Bob Callaghan', iban: 'IE64 IRCE …78', balance: 11904.10, type: 'Savings' },
  { id: 'acc_03', holder: 'Ciara Doyle',   iban: 'IE12 BOFI …78', balance: 712.44,   type: 'Current' },
];

const TXNS: Txn[] = [
  { id: 't1', accountId: 'acc_01', merchant: 'Ryanair',       amount: -89.99, date: '12 Jul', disputed: false },
  { id: 't2', accountId: 'acc_01', merchant: 'Dunnes Stores', amount: -47.20, date: '11 Jul', disputed: false },
  { id: 't3', accountId: 'acc_01', merchant: 'Salary',        amount: 2400,   date: '01 Jul', disputed: false },
  { id: 't4', accountId: 'acc_01', merchant: 'ESB Networks',  amount: -112.4, date: '28 Jun', disputed: false },
];

const PAYEES = ['Ryanair', 'Dunnes Stores', 'ESB Networks', 'Vodafone Ireland', 'An Post', 'Coombe Properties (Landlord)', 'Circle K', 'Leap Card', 'Electric Ireland', 'Gas Networks Ireland'];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getAccount(id: string): Promise<Account> {
  await wait(400);
  const a = ACCOUNTS.find((x) => x.id === id);
  if (!a) throw new Response(`Account ${id} not found`, { status: 404 });
  return a;
}

export async function getTransactions(accountId: string): Promise<Txn[]> {
  await wait(400);
  return TXNS.filter((t) => t.accountId === accountId);
}

// ── Demo 01 · useFetcher ─────────────────────────────────────────
export async function disputeTransaction(txnId: string): Promise<Txn> {
  await wait(900);
  const t = TXNS.find((x) => x.id === txnId);
  if (!t) throw new Response('Transaction not found', { status: 404 });
  t.disputed = true;
  return t;
}

// ── Demo 02 · Form + action + useActionData ─────────────────────
export type PaymentInput = { payee: string; amount: string };
export type PaymentErrors = { payee?: string; amount?: string };

export function validatePayment(input: PaymentInput): PaymentErrors {
  const errors: PaymentErrors = {};
  if (!input.payee.trim()) errors.payee = 'Payee is required.';
  const amountNum = Number(input.amount);
  if (!input.amount.trim()) errors.amount = 'Amount is required.';
  else if (Number.isNaN(amountNum) || amountNum <= 0) errors.amount = 'Enter a positive number.';
  else if (amountNum > ACCOUNTS[0].balance) errors.amount = `Exceeds available balance (€${ACCOUNTS[0].balance.toFixed(2)}).`;
  return errors;
}

export async function submitPayment(input: PaymentInput): Promise<{ paymentId: string }> {
  await wait(900);
  ACCOUNTS[0].balance -= Number(input.amount);
  return { paymentId: `pay_${Math.random().toString(36).slice(2, 8)}` };
}

// ── Demo 03 · useSubmit ──────────────────────────────────────────
export async function searchPayees(query: string): Promise<string[]> {
  await wait(350);
  if (!query.trim()) return PAYEES;
  return PAYEES.filter((p) => p.toLowerCase().includes(query.toLowerCase()));
}

// ── Demo 04 · useRevalidator ─────────────────────────────────────
// A module-level counter that quietly changes "server-side" balance each
// time it's read a certain number of times — simulating another channel
// (a branch deposit, a card transaction) posting while this tab sits open.
let liveReadCount = 0;
export async function getLiveBalance(id: string): Promise<{ balance: number; asOf: string }> {
  await wait(400);
  liveReadCount++;
  const a = ACCOUNTS.find((x) => x.id === id)!;
  if (liveReadCount % 2 === 0) a.balance += 25.5; // simulate an external deposit landing
  return { balance: a.balance, asOf: new Date().toLocaleTimeString('en-IE') };
}

// ── Demo 06/07 · useMatches + useRouteLoaderData ─────────────────
export async function getAccountForDirectory(id: string): Promise<Account> {
  await wait(400);
  const a = ACCOUNTS.find((x) => x.id === id);
  if (!a) throw new Response(`Account ${id} not found`, { status: 404 });
  return a;
}
