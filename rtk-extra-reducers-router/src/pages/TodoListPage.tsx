import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { deleteTodo, fetchTodos, selectCompletedCount, selectListStatus, selectMutationStatus, selectTodos, selectTodosError, updateTodo } from '../features/todos/todosSlice'

export function TodoListPage() {
  const dispatch = useAppDispatch()
  const todos = useAppSelector(selectTodos)
  const completedCount = useAppSelector(selectCompletedCount)
  const listStatus = useAppSelector(selectListStatus)
  const mutationStatus = useAppSelector(selectMutationStatus)
  const error = useAppSelector(selectTodosError)

  useEffect(() => {
    if (listStatus === 'idle') void dispatch(fetchTodos())
  }, [dispatch, listStatus])

  if (listStatus === 'loading') return <p>Loading todos...</p>
  if (listStatus === 'failed') return <p className="error">{error}</p>

  return (
    <section>
      <div className="page-heading">
        <div><h1>Todos</h1><p>{completedCount} of {todos.length} completed</p></div>
        <Link className="button-link" to="/todos/new">Create todo</Link>
      </div>
      <div className="todo-grid">
        {todos.map((todo) => (
          <article className="card" key={todo.id}>
            <h2>{todo.title}</h2>
            <p>Status: <strong>{todo.completed ? 'Completed' : 'Open'}</strong></p>
            <div className="actions">
              <Link to={`/todos/${todo.id}`}>Details</Link>
              <Link to={`/todos/${todo.id}/edit`}>Edit</Link>
              <button disabled={mutationStatus === 'loading'} onClick={() => void dispatch(updateTodo({ id: todo.id, changes: { completed: !todo.completed } }))}>Toggle</button>
              <button className="danger" disabled={mutationStatus === 'loading'} onClick={() => void dispatch(deleteTodo(todo.id))}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
