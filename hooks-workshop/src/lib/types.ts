export interface Account {
  id: string;
  iban: string;
  holderName: string;
  balance: number;
  currency: 'EUR';
}

export interface Transaction {
  id: string;
  accountId: string;
  description: string;
  amount: number;
  date: string;
  flagged: boolean;
  note?: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  iban: string;
}
