// ┌──────────────────────────────────────────────────────────────
// │ Day 3 · RHF · 02-register-validate.tsx
// │ ONE IDEA: the three core pieces — register (wire a field),
// │           handleSubmit (validate then call you), formState.errors
// │           (per-field messages). Native rules, no extra library yet.
// └──────────────────────────────────────────────────────────────
import { useForm } from 'react-hook-form';

type Form = { name: string; email: string; creditLimit: number };

export default function RegisterValidate() {
  // CRITICAL v7 pitfall: destructure errors/isValid HERE, before any JSX/
  // condition. formState is a Proxy — it only subscribes to fields you read
  // during render. Read them inside a condition and the subscription misses.
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ mode: 'onTouched' });

  const onSubmit = (data: Form) => {
    // Only runs if validation passed. `data` is the whole typed form.
    alert(`Saved: ${data.name} · ${data.email} · €${data.creditLimit}`);
  };

  return (
    <form className="card formcard" onSubmit={handleSubmit(onSubmit)}>
      <h3>register + handleSubmit + errors</h3>

      <div className="field"><label>Name</label>
        {/* register wires the input and attaches validation rules inline. */}
        <input className={errors.name ? 'invalid' : ''}
               {...register('name', { required: 'Name is required' })} />
        {errors.name && <span className="err">{errors.name.message}</span>}
      </div>

      <div className="field"><label>Email</label>
        <input className={errors.email ? 'invalid' : ''}
               {...register('email', {
                 required: 'Email is required',
                 pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
               })} />
        {errors.email && <span className="err">{errors.email.message}</span>}
      </div>

      <div className="field"><label>Credit limit (€)</label>
        <input type="number" className={errors.creditLimit ? 'invalid' : ''}
               {...register('creditLimit', {
                 required: 'Required',
                 min: { value: 1000, message: 'Must be 1000 or more' },
                 valueAsNumber: true,   // coerce the string to a number
               })} />
        {errors.creditLimit && <span className="err">{errors.creditLimit.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>Save customer</button>
      <p className="note">
        Three pieces do everything: <code>register('name', rules)</code> wires the field and its
        validation; <code>handleSubmit(onSubmit)</code> runs validation and only calls your handler if
        it passes; <code>errors.name.message</code> gives the per-field message. Compare Stage 1,
        where you hand-wrote every value binding, every error state, and the validity check.{' '}
        <code>valueAsNumber</code> even fixes the “params are strings” problem from earlier — RHF
        coerces for you.
      </p>
    </form>
  );
}
