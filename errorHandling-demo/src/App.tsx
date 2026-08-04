import { useState } from 'react';
import WhatABoundaryDoesNotCatch from './demos/01-what-a-boundary-does-not-catch';
import AsyncErrorsNeedTryCatch from './demos/02-async-errors-need-trycatch';
import GranularBoundaries from './demos/03-granular-boundaries';
import RetryAndReset from './demos/04-retry-and-reset';
import RetryWithBackoff from './demos/05-retry-with-backoff';
import RootLevelErrorHooks from './demos/06-root-level-error-hooks';

const DEMOS = [
  { id: '01', file: '01-what-a-boundary-does-not-catch.tsx', title: 'What a boundary does NOT catch',
    ask: 'Four ways to throw: render, click handler, timeout, promise. Which does the boundary catch?',
    node: <WhatABoundaryDoesNotCatch /> },
  { id: '02', file: '02-async-errors-need-trycatch.tsx', title: 'Async errors need try/catch',
    ask: 'A boundary can’t catch a failed fetch. So how do you show that error to the user?',
    node: <AsyncErrorsNeedTryCatch /> },
  { id: '03', file: '03-granular-boundaries.tsx', title: 'Granular boundaries',
    ask: 'One widget crashes. Should the whole dashboard blank, or just that widget?',
    node: <GranularBoundaries /> },
  { id: '04', file: '04-retry-and-reset.tsx', title: 'Retry & reset',
    ask: 'A boundary is showing its error. What does “retry” actually have to do to recover?',
    node: <RetryAndReset /> },
  { id: '05', file: '05-retry-with-backoff.tsx', title: 'Retry with backoff',
    ask: 'A flaky network call fails. Retry instantly in a loop, or wait — and how long?',
    node: <RetryWithBackoff /> },
  { id: '06', file: '06-root-level-error-hooks.tsx', title: 'React 19 root-level hooks',
    ask: 'A boundary caught the error. How does your logging service also find out?',
    node: <RootLevelErrorHooks /> },
] as const;

export default function App() {
  const [id, setId] = useState('01');
  const demo = DEMOS.find((d) => d.id === id)!;
  return (
    <div className="shell">
      <nav className="rail">
        <h1>Error Handling</h1>
        <p>& resilience</p>
        {DEMOS.map((d) => (
          <button key={d.id} className={d.id === id ? 'on' : ''}
                  onClick={() => { console.clear(); setId(d.id); }}>
            {d.id} · {d.title}
          </button>
        ))}
      </nav>
      <main className="page">
        <h2>{demo.title}</h2>
        <p className="sub mono">src/demos/{demo.file}</p>
        <p className="ask"><strong>Predict first:</strong> {demo.ask}</p>
        <div key={demo.id}>{demo.node}</div>
      </main>
    </div>
  );
}
