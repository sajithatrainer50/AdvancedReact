import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const style = (bg: string) => `background:${bg};color:#fff;padding:1px 5px;border-radius:3px`;

/* React 19 root-level error handlers. These fire for the WHOLE app.
   Demo 06 triggers an error so you can watch onCaughtError fire alongside
   the boundary's own componentDidCatch. In production this is your Sentry funnel. */
createRoot(document.getElementById('root')!, {
  onCaughtError: (error) =>
    console.log('%c ROOT %c onCaughtError (a boundary handled it): ' + String(error),
      style('#854F0B'), ''),
  onUncaughtError: (error) =>
    console.log('%c ROOT %c onUncaughtError (nothing caught it): ' + String(error),
      style('#A32D2D'), ''),
  onRecoverableError: (error) =>
    console.log('%c ROOT %c onRecoverableError (React recovered): ' + String(error),
      style('#5F5E5A'), ''),
}).render(<App />);
