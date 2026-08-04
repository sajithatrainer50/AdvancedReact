import type { Account, Transaction } from './types';

const HOLDERS = ['Aoife', 'Cian', 'Niamh', 'Sean', 'Roisin', 'Declan', 'Grainne', 'Fionn'];
const MERCHANTS = [
  'Tesco Ireland',
  'SSE Airtricity',
  'Ryanair',
  'Eir',
  'An Post',
  'Dublin Bus',
  'Boots Pharmacy',
  'Centra',
  'Circle K',
  'Applegreen',
];

export function formatEUR(amount: number): string {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(amount);
}

export function generateIban(seed: number): string {
  const digits = String(10000000000000 + seed * 137).slice(0, 12);
  return `IE29 NORB ${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)}`;
}

export function generateAccounts(count = 5): Account[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `acc-${i + 1}`,
    iban: generateIban(i + 1),
    holderName: HOLDERS[i % HOLDERS.length],
    balance: 1200 + i * 733.5,
    currency: 'EUR',
  }));
}

export function generateTransactions(count: number, accountId = 'acc-1'): Transaction[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `txn-${accountId}-${i}`,
    accountId,
    description: MERCHANTS[i % MERCHANTS.length],
    amount: Number((((i % 13) + 1) * -8.4).toFixed(2)),
    date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
    flagged: false,
  }));
}

export function simulateServerCall<T>(value: T, { ms = 700, failRate = 0 } = {}): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failRate) reject(new Error('NexusPay gateway timeout'));
      else resolve(value);
    }, ms);
  });
}

// Deliberately CPU-heavy so a table of these stands in for a real per-row
// compliance calculation - useful for feeling the difference urgent vs
// non-urgent updates make.
export function computeRiskScore(seed: number): number {
  let x = Math.floor(Math.abs(seed) * 1000) || 1;
  for (let i = 0; i < 5000; i++) {
    x = (x * 9301 + 49297) % 233280;
  }
  return x % 100;
}
