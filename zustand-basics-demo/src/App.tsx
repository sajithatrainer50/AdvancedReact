import { useState } from 'react';
import { CounterPage } from './pages/CounterPage';
import { BankPage } from './pages/BankPage';
import './index.css';

type Tab = 'counter' | 'bank';

export default function App() {
  const [tab, setTab] = useState<Tab>('counter');

  return (
    <div className="app">
      <header className="app-header">
        <h1>Zustand Basics</h1>
        <nav className="tabs">
          <button
            className={tab === 'counter' ? 'active' : ''}
            onClick={() => setTab('counter')}
          >
            1. Counter
          </button>
          <button
            className={tab === 'bank' ? 'active' : ''}
            onClick={() => setTab('bank')}
          >
            2. Bank Account
          </button>
        </nav>
      </header>

      <main>{tab === 'counter' ? <CounterPage /> : <BankPage />}</main>
    </div>
  );
}
