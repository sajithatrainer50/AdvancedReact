import { createContext, Suspense, use, useState, type ReactNode } from 'react';

// Reading promises and context with a hook that can be called conditionally

interface AccountSummary {
  iban: string;
  balance: number;
  tier: 'standard' | 'premier';
}

function fetchAccountSummary(): Promise<AccountSummary> {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ iban: 'IE29 NORB 9821 3345 1120', balance: 8420.15, tier: 'premier' }), 1200)
  );
}

const FeatureFlagsContext = createContext({ showComplianceBadge: true });

function AccountCard({ summaryPromise }: { summaryPromise: Promise<AccountSummary> }) {
  const summary = use(summaryPromise);

  let complianceBadge: ReactNode = null;
  if (summary.tier === 'premier') {
    // conditional hook call - only valid because `use` isn't bound by the Rules of Hooks
    const flags = use(FeatureFlagsContext);
    if (flags.showComplianceBadge) {
      complianceBadge = <span className="badge bg-info ms-2">Enhanced due diligence</span>;
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{summary.iban}</h5>
        <p className="card-text">
          Balance: {summary.balance.toFixed(2)} {complianceBadge}
        </p>
      </div>
    </div>
  );
}

export default function UseHookDemo() {
  const [summaryPromise] = useState(() => fetchAccountSummary());

  return (
    <div className="container py-4">
      <h3 className="mb-3">Account Summary</h3>
      <FeatureFlagsContext.Provider value={{ showComplianceBadge: true }}>
        <Suspense fallback={<div className="spinner-border" role="status" />}>
          <AccountCard summaryPromise={summaryPromise} />
        </Suspense>
      </FeatureFlagsContext.Provider>
    </div>
  );
}
