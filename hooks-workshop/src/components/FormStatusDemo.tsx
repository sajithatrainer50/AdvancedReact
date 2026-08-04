import { useFormStatus } from 'react-dom';
import { simulateServerCall } from '../lib/mockBank';

// Letting a child button read its parent form's pending state directly

async function submitKyc(formData: FormData) {
  await simulateServerCall(true, { ms: 1000 });
  console.log('KYC submitted for', formData.get('customerId'));
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-success" disabled={pending}>
      {pending ? 'Uploading…' : 'Submit KYC Documents'}
    </button>
  );
}

export default function FormStatusDemo() {
  return (
    <div className="container py-4">
      <h3 className="mb-3">KYC Document Submission — NorthBridge Onboarding</h3>
      <form action={submitKyc} className="w-50">
        <div className="mb-3">
          <label className="form-label">Customer ID</label>
          <input name="customerId" className="form-control" defaultValue="CUST-88231" />
        </div>
        <SubmitButton />
      </form>
    </div>
  );
}
