// ┌──────────────────────────────────────────────────────────────
// │ Error Handling · lib/ErrorBoundary.tsx
// │ An error boundary built from scratch. Still a CLASS in 2026 —
// │ there is no hook equivalent, and this is the whole reason classes
// │ have not fully disappeared from React.
// └──────────────────────────────────────────────────────────────
import { Component, type ReactNode, type ErrorInfo } from 'react';

type Props = {
  children: ReactNode;
  // A render prop for the fallback so callers control the UI (demo 04).
  fallback: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
};
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  // PHASE 1 — render phase. Runs during rendering, must be pure, returns the
  // next state. This is what actually flips the boundary into its error UI.
  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  // PHASE 2 — commit phase. Runs AFTER the DOM updates. The place for side
  // effects: logging to Sentry, analytics, etc. Never put logging in phase 1.
  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
    console.log('%c BOUNDARY %c caught: ' + error.message,
      'background:#A32D2D;color:#fff;padding:1px 5px;border-radius:3px', '');
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, this.reset);
    }
    return this.props.children;
  }
}
