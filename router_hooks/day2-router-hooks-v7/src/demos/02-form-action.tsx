// ┌──────────────────────────────────────────────────────────────
// │ 02-form-action.tsx
// │ WHAT IT OFFERS: a real submission (<Form method="post">) tied to a
// │ route's own `action`, with validation errors returned to the SAME
// │ page via useActionData() — no client-side-only validation state,
// │ no manual fetch-then-setState wiring for the submit itself.
// │
// │ BEST USE CASE: any "create/update" form where invalid input should
// │ redisplay the form with inline errors AND the values the user typed
// │ — a payment, a KYC field, any write the server must have the final
// │ say on (balance checks, business rules) rather than trusting the
// │ client alone.
// └──────────────────────────────────────────────────────────────
import { Form, useActionData, useNavigation, redirect, type ActionFunctionArgs } from 'react-router';
import { validatePayment, submitPayment, type PaymentErrors } from '../data/fakeApi';

type ActionResult = { errors: PaymentErrors; values: { payee: string; amount: string } };

export async function newPaymentAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const input = { payee: String(formData.get('payee') ?? ''), amount: String(formData.get('amount') ?? '') };

  const errors = validatePayment(input);
  if (Object.keys(errors).length > 0) {
    // RETURNED, not thrown — this is a user-correctable problem. Throwing
    // would tear down the form entirely and hand it to the ErrorBoundary;
    // returning keeps the user right where they are, with their input intact.
    return { errors, values: input } satisfies ActionResult;
  }

  const result = await submitPayment(input);
  // Success -> redirect. This is the ONE case where leaving the page is right.
  return redirect(`/new-payment/success/${result.paymentId}`);
}

export default function NewPaymentForm() {
  // useActionData() is undefined until the FIRST submission — there's no
  // error UI to show before the user has tried anything.
  const actionData = useActionData() as ActionResult | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div>
      <h2>Form + action + useActionData — validated payment</h2>
      <div className="offers"><strong>Offers:</strong> server-style validation with errors AND the submitted values handed back to the same page — no separate client validation state to maintain.</div>
      <div className="usecase"><strong>Best use case:</strong> any create/update form where the server (business rules, balance checks) must have final say, not just the client.</div>

      <div className="card">
        <Form method="post">
          <div className="field">
            <label htmlFor="payee">Payee</label>
            <input id="payee" name="payee" defaultValue={actionData?.values.payee} placeholder="e.g. Vodafone Ireland" />
            {actionData?.errors.payee && <p className="err">{actionData.errors.payee}</p>}
          </div>
          <div className="field">
            <label htmlFor="amount">Amount (EUR)</label>
            <input id="amount" name="amount" defaultValue={actionData?.values.amount} placeholder="e.g. 45.00" />
            {actionData?.errors.amount && <p className="err">{actionData.errors.amount}</p>}
          </div>
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'submitting…' : 'Send payment'}</button>
        </Form>
        <p className="note">
          Try submitting empty, then a negative amount, then something over €4,182.66 (acc_01's
          balance) — each time the page stays put, your input is preserved via defaultValue, and
          the specific field error appears. Only a genuinely valid submission redirects away.
        </p>
      </div>
    </div>
  );
}

export function PaymentSuccess() {
  return (
    <div className="card">
      <h3 className="ok">✓ Payment sent</h3>
      <p className="hint">This page only exists because the action returned redirect(...) — a genuinely successful submission is the one case that should leave the form.</p>
    </div>
  );
}
