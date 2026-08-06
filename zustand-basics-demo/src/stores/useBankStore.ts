import { create } from 'zustand';

export type Transaction = {
  id: number;
  type: 'deposit' | 'withdraw';
  amount: number;
};

type BankState = {
  balance: number;
  transactions: Transaction[];
  deposit: (amount: number) => void;
  withdraw: (amount: number) => boolean; // returns success/failure
};

export const useBankStore = create<BankState>()((set, get) => ({
  balance: 1000,
  transactions: [],

  deposit: (amount) =>
    set((state) => ({
      balance: state.balance + amount,
      transactions: [
        ...state.transactions,
        { id: Date.now(), type: 'deposit', amount },
      ],
    })),

  // REAL PATTERN: guard BEFORE calling set().
  // get() reads the live balance so we can validate the withdrawal
  // without ever putting the account into an invalid state.
  // If validation fails, we simply never call set() — no update,
  // no re-render, nothing happens on screen except our return value.
  withdraw: (amount) => {
    const { balance } = get();
    if (amount > balance) {
      return false; // insufficient funds
    }
    set((state) => ({
      balance: state.balance - amount,
      transactions: [
        ...state.transactions,
        { id: Date.now(), type: 'withdraw', amount },
      ],
    }));
    return true;
  },
}));

// ─────────────────────────────────────────────────────────────
// A NOTE ON set(newState, true) — the "replace" flag
//
// set() takes an optional 2nd argument: set(partialState, replace?).
//   - replace = false (default) → MERGE partialState into existing state
//   - replace = true            → REPLACE the entire state object
//
// If we called set({ balance: 1000, transactions: [] }, true) here,
// it would wipe out deposit and withdraw too, because in Zustand your
// actions live INSIDE the same state object as your data. The store
// would still exist, but calling useBankStore.getState().deposit()
// afterwards would throw, because deposit no longer exists.
// replace:true is only safe when the object you pass includes
// EVERY key the state currently has — data AND actions.
// ─────────────────────────────────────────────────────────────
