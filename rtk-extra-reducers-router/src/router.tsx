import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { CreateTodoPage } from './pages/CreateTodoPage'
import { EditTodoPage } from './pages/EditTodoPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RouteErrorPage } from './pages/RouteErrorPage'
import { TodoDetailsPage } from './pages/TodoDetailsPage'
import { TodoListPage } from './pages/TodoListPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    ErrorBoundary: RouteErrorPage,
    children: [
      { index: true, Component: HomePage },
      { path: 'todos', Component: TodoListPage },
      { path: 'todos/new', Component: CreateTodoPage },
      { path: 'todos/:todoId', Component: TodoDetailsPage },
      { path: 'todos/:todoId/edit', Component: EditTodoPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
