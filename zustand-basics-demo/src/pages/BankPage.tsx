import { useEffect, useState } from 'react';
import { useBankStore } from '../stores/useBankStore';

export function BankPage() {
  // Two separate selectors — each subscribes independently.
  const balance = useBankStore((state) => state.balance);
  const transactions = useBankStore((state) => state.transactions);
  const deposit = useBankStore((state) => state.deposit);
  const withdraw = useBankStore((state) => state.withdraw);

  const [amount, setAmount] = useState(100);
  const [message, setMessage] = useState('');

  // ───────────────────────────────────────────────────────────
  // REAL PATTERN: useBankStore.subscribe(listener)
  //
  // subscribe is NOT a hook — it's a method sitting directly on the
  // store object (create() attaches it there). You can call it from
  // anywhere: inside useEffect, inside a plain .ts file, in a
  // websocket handler, in a test. It fires on every state change,
  // and hands you (newState, previousState).
  //
  // This is how you run side effects (logging, analytics, syncing to
  // localStorage) WITHOUT making a component re-render just to do it —
  // this component already re-renders from the selectors above, so
  // this subscribe is only here to prove the mechanism. In real code
  // you'd often put a subscribe like this in main.tsx or a dedicated
  // file, completely outside any component.
  //
  // subscribe() returns an unsubscribe function — always clean it up.
  // ───────────────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = useBankStore.subscribe((state, prevState) => {
      if (state.balance !== prevState.balance) {
        console.log(
          `%cbalance changed: ${prevState.balance} → ${state.balance}`,
          'color: #1565c0'
        );
      }
    });
    return () => unsubscribe(); // always unsubscribe on unmount
  }, []);

  const handleDeposit = () => {
    deposit(amount);
    setMessage(`Deposited ${amount}`);
  };

  const handleWithdraw = () => {
    const success = withdraw(amount);
    setMessage(success ? `Withdrew ${amount}` : `Declined — insufficient funds`);
  };

  // ───────────────────────────────────────────────────────────
  // REAL PATTERN: useBankStore.getState() — a one-off, non-reactive read.
  // Called directly on the store, NOT inside a selector, so this does
  // NOT subscribe the component to anything. It just reads whatever
  // the state is at the moment the button is clicked. Same idea as
  // get() inside an action — just called from outside the store.
  // ───────────────────────────────────────────────────────────
  const handleLogState = () => {
    const state = useBankStore.getState();
    console.log('current bank state (getState):', state);
  };

  // ───────────────────────────────────────────────────────────
  // REAL PATTERN: useBankStore.setState() — updating from OUTSIDE
  // any action defined in the store. Same merge/replace rules as the
  // set() you get inside create() — because it's the same function.
  // Useful for things like: a websocket push, a dev-tools button, or
  // code that lives outside the store file entirely.
  // ───────────────────────────────────────────────────────────
  const handleExternalAdjustment = () => {
    useBankStore.setState({ balance: 5000 });
    setMessage('Balance force-set to 5000 via setState() — no action was called');
  };

  return (
    <section className="page">
      <h2>Bank Account — get / set / subscribe from outside a component</h2>
      <p className="count-display">€{balance.toLocaleString()}</p>

      <label className="step-control">
        Amount:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </label>

      <div className="button-row">
        <button onClick={handleDeposit}>Deposit</button>
        <button onClick={handleWithdraw}>Withdraw</button>
      </div>

      <div className="button-row">
        <button onClick={handleLogState} className="secondary">
          Log state (getState)
        </button>
        <button onClick={handleExternalAdjustment} className="secondary">
          Force balance via setState
        </button>
      </div>

      {message && <p className="message">{message}</p>}

      <h3>Transactions</h3>
      {transactions.length === 0 ? (
        <p className="hint">No transactions yet.</p>
      ) : (
        <ul className="tx-list">
          {transactions
            .slice()
            .reverse()
            .map((tx) => (
              <li key={tx.id} className={tx.type}>
                {tx.type === 'deposit' ? '+' : '−'}€{tx.amount}
              </li>
            ))}
        </ul>
      )}

      <p className="hint">
        Try "Withdraw" with an amount bigger than the balance — the
        store's <code>get()</code> check inside <code>withdraw()</code>{' '}
        blocks it before <code>set()</code> is ever called. Then try "Force
        balance via setState" — that bypasses <code>deposit</code>/
        <code>withdraw</code> entirely and writes straight to the store.
      </p>
    </section>
  );
}
