import { NavLink, Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div>
          <strong>RTK ExtraReducers - TypeScript</strong>
          <p>React Router v7 createBrowserRouter demo</p>
        </div>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/todos">Todos</NavLink>
          <NavLink to="/todos/new">Create</NavLink>
        </nav>
      </header>
      <main className="container"><Outlet /></main>
    </div>
  )
}
