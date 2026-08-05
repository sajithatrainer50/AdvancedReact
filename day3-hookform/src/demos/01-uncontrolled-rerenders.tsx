// ┌──────────────────────────────────────────────────────────────
// │ Day 3 · RHF · 01-uncontrolled-rerenders.tsx
// │ ONE IDEA: RHF's core pitch. Controlled inputs (Stage 1) re-render
// │           on every keystroke. RHF is uncontrolled — it reads values
// │           via refs, so the form barely re-renders while typing.
// └──────────────────────────────────────────────────────────────
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRenderCount } from '../probe';

// LEFT: the Stage 1 way — controlled, one useState per field. Every keystroke
// calls setState -> the whole form re-renders.
function ControlledForm() {
  const renders = useRenderCount('ControlledForm (Stage 1 way)');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  return (
    <div style={{ border: '1px solid var(--bad)', borderRadius: 8, padding: 12 }}>
      <span className="lbl bad">controlled — re-renders every keystroke</span>
      <div className="field"><label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div className="field"><label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <strong>form renders: {renders}</strong>
    </div>
  );
}

// RIGHT: the RHF way — register wires the input via a REF, uncontrolled. Typing
// doesn't call setState, so the component doesn't re-render on each keystroke.
function HookForm() {
  const renders = useRenderCount('HookForm (RHF way)');
  const { register } = useForm<{ name: string; email: string }>();
  return (
    <div style={{ border: '1px solid var(--ok)', borderRadius: 8, padding: 12 }}>
      <span className="lbl ok">RHF — barely re-renders while typing</span>
      <div className="field"><label>Name</label>
        <input {...register('name')} /></div>
      <div className="field"><label>Email</label>
        <input {...register('email')} /></div>
      <strong>form renders: {renders}</strong>
    </div>
  );
}

export default function UncontrolledRerenders() {
  return (
    <div>
      <p className="note" style={{ marginBottom: 14 }}>
        <strong>Open the console. Type in BOTH forms and watch the render counts.</strong>
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <ControlledForm />
        <HookForm />
      </div>
      <p className="note">
        The controlled form’s render count climbs on <strong>every keystroke</strong> — that’s
        Stage 1’s model, and it’s why big controlled forms lag. RHF’s form barely moves: it wires
        each input to a <strong>ref</strong> via <code>register</code>, so values live in the DOM
        (uncontrolled) and typing doesn’t trigger React state updates. This is RHF’s entire reason to
        exist: <strong>uncontrolled-first forms that don’t re-render while you type</strong>, even
        with dozens of fields.
      </p>
    </div>
  );
}
