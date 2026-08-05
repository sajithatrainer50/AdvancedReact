import { useState } from 'react';
import UncontrolledRerenders from './demos/01-uncontrolled-rerenders';
import RegisterValidate from './demos/02-register-validate';
import ZodResolver from './demos/03-zod-resolver';
import FormStateProxyPitfall from './demos/04-formstate-proxy-pitfall';

const DEMOS = [
  { id: '01', file: '01-uncontrolled-rerenders.tsx', title: 'Why RHF exists (re-renders)',
    ask: 'Stage 1 forms re-render on every keystroke. How often does an RHF form re-render while typing?',
    node: <UncontrolledRerenders /> },
  { id: '02', file: '02-register-validate.tsx', title: 'register + handleSubmit + errors',
    ask: 'Stage 1 needed value bindings, error states, and a validity check by hand. How many pieces does RHF need?',
    node: <RegisterValidate /> },
  { id: '03', file: '03-zod-resolver.tsx', title: 'Zod schema validation',
    ask: 'Where should the type, the rules, and the error messages live — three places, or one?',
    node: <ZodResolver /> },
  { id: '04', file: '04-formstate-proxy-pitfall.tsx', title: 'The formState Proxy pitfall',
    ask: 'You read formState.isValid inside an if-statement and the button never enables. Why?',
    node: <FormStateProxyPitfall /> },
] as const;

export default function App() {
  const [id, setId] = useState('01');
  const demo = DEMOS.find((d) => d.id === id)!;
  return (
    <div className="shell">
      <nav className="rail">
        <h1>Day 3 · RHF</h1>
        <p>React Hook Form</p>
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
