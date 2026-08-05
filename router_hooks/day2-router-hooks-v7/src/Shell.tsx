import { NavLink, Outlet, useNavigation } from 'react-router';

export function Shell() {
  const navigation = useNavigation();
  return (
    <div className="shell">
      <nav className="rail">
        <h1>NorthBridge</h1>
        <p>router v7 · untouched hooks {navigation.state === 'loading' ? '· ⏳' : ''}</p>
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'on' : '')}>Menu</NavLink>
        <NavLink to="/dispute" className={({ isActive }) => (isActive ? 'on' : '')}>01 · useFetcher</NavLink>
        <NavLink to="/new-payment" className={({ isActive }) => (isActive ? 'on' : '')}>02 · Form + action</NavLink>
        <NavLink to="/search-payees" className={({ isActive }) => (isActive ? 'on' : '')}>03 · useSubmit</NavLink>
        <NavLink to="/live-balance/acc_01" className={({ isActive }) => (isActive ? 'on' : '')}>04 · useRevalidator</NavLink>
        <NavLink to="/payment-draft" className={({ isActive }) => (isActive ? 'on' : '')}>05 · useBlocker</NavLink>
        <NavLink to="/directory" className={({ isActive }) => (isActive ? 'on' : '')}>06/07 · useMatches + useRouteLoaderData</NavLink>
      </nav>
      <main className="page"><Outlet /></main>
    </div>
  );
}
