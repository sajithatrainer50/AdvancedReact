import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'

export function RouteErrorPage() {
  const error: unknown = useRouteError()
  let message = 'An unexpected route error occurred.'
  if (isRouteErrorResponse(error)) message = `${error.status} ${error.statusText}`
  else if (error instanceof Error) message = error.message
  return <section><h1>Route error</h1><p className="error">{message}</p><Link to="/">Return home</Link></section>
}
