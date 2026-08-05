// ┌──────────────────────────────────────────────────────────────
// │ Day 3 · RHF · 03-zod-resolver.tsx
// │ ONE IDEA: move validation into a Zod SCHEMA — one place defines the
// │           types, the rules, AND the messages. zodResolver connects it.
// └──────────────────────────────────────────────────────────────
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// ONE schema = the single source of truth. It produces the TypeScript type
// (via z.infer), the validation rules, and the error messages together.
const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  creditLimit: z.coerce.number().min(0, 'Must be 0 or more'),
});
type CustomerForm = z.infer<typeof customerSchema>;   // type derived from schema

export default function ZodResolver() {
  const {
    register,
    handleSubmit, 
    formState: { errors },
  } = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),   // <- the entire integration
    mode: 'onTouched',
  });

  return (
    <form className="card formcard" onSubmit={handleSubmit((d) => alert(JSON.stringify(d, null, 2)))}>
      <h3>Validation as a Zod schema</h3>
      <div className="field"><label>Name</label>
        <input className={errors.name ? 'invalid' : ''} {...register('name')} />
        {errors.name && <span className="err">{errors.name.message}</span>}</div>
      <div className="field"><label>Email</label>
        <input className={errors.email ? 'invalid' : ''} {...register('email')} />
        {errors.email && <span className="err">{errors.email.message}</span>}</div>
      <div className="field"><label>Credit limit (€)</label>
        <input className={errors.creditLimit ? 'invalid' : ''} {...register('creditLimit')} />
        {errors.creditLimit && <span className="err">{errors.creditLimit.message}</span>}</div>
      <button type="submit">Save customer</button>
      <p className="note">
        The rules moved out of <code>register</code> and into <code>customerSchema</code>.{' '}
        <code>zodResolver(customerSchema)</code> is the whole integration — RHF calls Zod on each
        validation event and turns Zod’s issues into its <code>errors</code> object. And{' '}
        <code>z.infer</code> derives the TypeScript type from the same schema, so type, rules, and
        messages all come from ONE definition. Change the schema, everything follows. This is the
        production standard: schema-driven, type-safe forms.
      </p>
    </form>
  );
}
