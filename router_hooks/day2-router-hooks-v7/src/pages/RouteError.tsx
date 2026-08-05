import { useRouteError, isRouteErrorResponse, Link } from 'react-router';

export default function RouteError() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div className="card" style={{ borderColor: '#c2410c' }}>
        <strong className="bad" style={{ fontSize: 18 }}>{error.status} — {error.statusText}</strong>
        <p className="hint">{String(error.data)}</p>
        <Link to="/">back to menu</Link>
      </div>
    );
  }
  return (
    <div className="card" style={{ borderColor: '#c2410c' }}>
      <strong className="bad">Something went wrong</strong>
      <p className="hint mono">{error instanceof Error ? error.message : 'Unknown'}</p>
      <Link to="/">back to menu</Link>
    </div>
  );
}
