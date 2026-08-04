import { useActionState } from 'react';
import { formatEUR, simulateServerCall } from '../lib/mockBank';

// Wiring a form to an async action without hand-rolled pending/error state

interface TransferResult {
  ok: boolean;
  message: string;
}

const BALANCE = 3400.5;

async function submitTransfer(_prev: TransferResult | null, formData: FormData): Promise<TransferResult> {
  const amount = Number(formData.get('amount'));
  const iban = String(formData.get('iban') || '');

  if (!iban || iban.length < 15) {
    return { ok: false, message: 'Enter a valid IBAN.' };
  }
  if (!amount || amount <= 0) {
    return { ok: false, message: 'Enter an amount greater than zero.' };
  }
  if (amount > BALANCE) {
    return { ok: false, message: `Amount exceeds available balance of ${formatEUR(BALANCE)}.` };
  }

  try {
    await simulateServerCall(true, { ms: 900, failRate: 0.25 });
  } catch {
    return { ok: false, message: 'NexusPay gateway timed out. Please try again.' };
  }

  return { ok: true, message: `Transferred ${formatEUR(amount)} to ${iban}.` };
}

export default function ActionStateDemo() {
  const [result, formAction, isPending] = useActionState(submitTransfer, null);

  return (
    <div className="container py-4">
      <h3 className="mb-3">NexusPay Transfer</h3>
      <p className="text-muted">Available balance: {formatEUR(BALANCE)}</p>

      <form action={formAction} className="w-50">
        <div className="mb-3">
          <label className="form-label">Beneficiary IBAN</label>
          <input name="iban" className="form-control" placeholder="IE29 NORB 1234 5678 9012" />
        </div>
        <div className="mb-3">
          <label className="form-label">Amount (EUR)</label>
          <input name="amount" type="number" step="0.01" className="form-control" />
        </div>
        <button className="btn btn-primary" disabled={isPending}>
          {isPending ? 'Sending…' : 'Send Transfer'}
        </button>
      </form>

      {result && (
        <div className={`alert mt-3 ${result.ok ? 'alert-success' : 'alert-danger'}`}>{result.message}</div>
      )}
    </div>
  );
}
