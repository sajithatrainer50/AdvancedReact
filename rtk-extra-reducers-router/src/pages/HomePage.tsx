import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <section>
      <h1>What this project teaches</h1>
      <div className="card">
        <p><code>createBrowserRouter</code> controls pages and URLs.</p>
        <p><code>createAsyncThunk</code> performs API requests.</p>
        <p><code>extraReducers</code> handles pending, fulfilled, and rejected actions.</p>
        <Link className="button-link" to="/todos">Open todos</Link>
      </div>
    </section>
  )
}
