// ┌──────────────────────────────────────────────────────────────
// │ Day 3 · RHF · 04-formstate-proxy-pitfall.tsx
// │ ONE IDEA (the #1 RHF gotcha): formState is a Proxy. It only
// │           subscribes to the flags you READ during render. Read isValid
// │           in the wrong place and it silently never updates.
// └──────────────────────────────────────────────────────────────
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({ name: z.string().min(2, 'Min 2 chars') });
type Form = z.infer<typeof schema>;

export default function FormStateProxyPitfall() {
  const {
    register,
    handleSubmit,
    // ✅ CORRECT: destructure isValid HERE, at the top level of render. This
    // reads the Proxy property during render, which registers the subscription,
    // so isValid updates as you type.
    formState: { isValid, errors },
  } = useForm<Form>({ resolver: zodResolver(schema), mode: 'onChange' });

  return (
    <form className="card formcard" onSubmit={handleSubmit(() => alert('valid!'))}>
      <h3>The formState Proxy pitfall</h3>
      <div className="field"><label>Name (min 2 chars)</label>
        <input className={errors.name ? 'invalid' : ''} {...register('name')} />
        {errors.name && <span className="err">{errors.name.message}</span>}</div>

      {/* isValid was destructured above, so this button enables/disables live. */}
      <button type="submit" disabled={!isValid}>
        {isValid ? 'Save (valid)' : 'Type 2+ chars…'}
      </button>

      <p className="note">
        <code>formState</code> is a <strong>Proxy</strong>: it only tracks the flags you actually read
        during render, so RHF can skip re-renders for flags you don’t use. The trap:{' '}
        <strong>you must destructure <code>isValid</code> at the top of render</strong> (as above). If
        you instead read <code>formState.isValid</code> inside a condition or callback, the Proxy
        never sees it during render, never subscribes, and <code>isValid</code> silently stays stale —
        the button never enables. This is the single most common RHF bug. Rule: destructure the flags
        you need, up front, unconditionally.
      </p>
    </form>
  );
}
