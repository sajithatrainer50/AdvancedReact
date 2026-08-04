// Use the Profiler tab (record -> interact -> stop) to see which component eats render time
import { useMemo, useState } from 'react';

interface ScheduleRow {
  month: number;
  interest: number;
  balance: number;
}

function buildAmortizationSchedule(principal: number, months: number): ScheduleRow[] {
  const rows: ScheduleRow[] = [];
  let balance = principal;
  for (let m = 1; m <= months; m++) {
    // deliberately heavy inner loop to simulate a real cost centre
    let interest = 0;
    for (let i = 0; i < 20000; i++) {
      interest += (balance * 0.0325) / 12 / 20000;
    }
    balance -= 400;
    rows.push({ month: m, interest, balance });
  }
  return rows;
}

export default function ProfilingReact() {
  const [months, setMonths] = useState(24);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [useMemoized, setUseMemoized] = useState(false);

  const scheduleDirect = buildAmortizationSchedule(15000, months);
  const scheduleMemoized = useMemo(() => buildAmortizationSchedule(15000, months), [months]);
  const schedule = useMemoized ? scheduleMemoized : scheduleDirect;

  return (
    <div className={`container py-4 ${theme === 'dark' ? 'bg-dark text-white' : ''}`}>
      <h4>NorthBridge — Loan Amortization Report</h4>

      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="memoSchedule"
          checked={useMemoized}
          onChange={(e) => setUseMemoized(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="memoSchedule">
          Memoize schedule with useMemo (currently: {useMemoized ? 'ON' : 'OFF'})
        </label>
      </div>

      <div className="d-flex gap-2 mb-3">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        >
          Toggle theme (unrelated state — should be cheap)
        </button>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => setMonths((m) => m + 12)}>
          Extend loan term (+12 months)
        </button>
      </div>

      <table className="table table-sm">
        <thead>
          <tr>
            <th>Month</th>
            <th>Interest</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {schedule.slice(0, 12).map((r) => (
            <tr key={r.month}>
              <td>{r.month}</td>
              <td>€{r.interest.toFixed(2)}</td>
              <td>€{r.balance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
