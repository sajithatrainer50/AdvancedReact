// ┌──────────────────────────────────────────────────────────────
// │ Router Hooks v7 · router.tsx
// │ Seven demos, each isolating ONE hook not covered in Modules 1-3.
// │ 06 and 07 deliberately share one nested route tree — see the
// │ `directory` section below — since useMatches (breadcrumbs) and
// │ useRouteLoaderData (ancestor data access) are both most convincing
// │ on genuinely nested routes, and building two separate trees just to
// │ keep them apart would be artificial.
// └──────────────────────────────────────────────────────────────
import { createBrowserRouter } from 'react-router';
import { Shell } from './Shell';
import { Menu } from './pages/Menu';
import RouteError from './pages/RouteError';

import DisputeTransactions, { transactionsAction, transactionsLoader } from './demos/01-usefetcher';
import NewPaymentForm, { newPaymentAction, PaymentSuccess } from './demos/02-form-action';
import SearchPayees, { searchPayeesLoader } from './demos/03-usesubmit';
import LiveBalance, { liveBalanceLoader } from './demos/04-userevalidator';
import PaymentDraft from './demos/05-useblocker';
import { DirectoryLayout, DirectoryHome } from './demos/06-usematches';
import { AccountPage, accountPageLoader, TransactionsPage, transactionsForAccountLoader } from './demos/07-userouteloaderdata';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Shell,
    ErrorBoundary: RouteError,
    children: [
      { index: true, Component: Menu },

      // 01 — useFetcher: per-row mutation, no navigation.
      {
        path: 'dispute',
        Component: DisputeTransactions,
        loader: transactionsLoader,
        action: transactionsAction,
      },

      // 02 — Form + action + useActionData: validated submission.
      { path: 'new-payment', Component: NewPaymentForm, action: newPaymentAction },
      { path: 'new-payment/success/:paymentId', Component: PaymentSuccess },

      // 03 — useSubmit: programmatic, debounced GET navigation.
      { path: 'search-payees', Component: SearchPayees, loader: searchPayeesLoader },

      // 04 — useRevalidator: refresh the current route, no navigation.
      { path: 'live-balance/:id', Component: LiveBalance, loader: liveBalanceLoader },

      // 05 — useBlocker: pause navigation on unsaved input.
      { path: 'payment-draft', Component: PaymentDraft },

      // 06/07 — shared nested tree: breadcrumbs (06) + ancestor data (07).
      {
        path: 'directory',
        Component: DirectoryLayout,
        handle: { crumb: 'Directory' },
        children: [
          { index: true, Component: DirectoryHome },
          {
            path: 'accounts/:id',
            id: 'account', // <- the id useRouteLoaderData('account') looks up
            Component: AccountPage,
            loader: accountPageLoader,
            handle: { crumb: (data: { holder: string }) => data.holder },
            children: [
              {
                path: 'transactions',
                Component: TransactionsPage,
                loader: transactionsForAccountLoader,
                handle: { crumb: 'Transactions' },
              },
            ],
          },
        ],
      },
    ],
  },
]);
