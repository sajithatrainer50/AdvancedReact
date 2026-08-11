import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchTodoById, selectDetailStatus, selectSelectedTodo, selectTodosError, selectedTodoCleared } from '../features/todos/todosSlice'

export function TodoDetailsPage() {
  const { todoId } = useParams<{ todoId: string }>()
  const dispatch = useAppDispatch()
  const todo = useAppSelector(selectSelectedTodo)
  const status = useAppSelector(selectDetailStatus)
  const error = useAppSelector(selectTodosError)
  const numericId = Number(todoId)

  useEffect(() => {
    if (Number.isInteger(numericId)) void dispatch(fetchTodoById(numericId))
    return () => { dispatch(selectedTodoCleared()) }
  }, [dispatch, numericId])

  if (!Number.isInteger(numericId)) return <p className="error">Invalid todo ID.</p>
  if (status === 'loading') return <p>Loading todo...</p>
  if (status === 'failed') return <p className="error">{error}</p>
  if (!todo) return null

  return (
    <section>
      <h1>Todo details</h1>
      <article className="card">
        <p>ID: {todo.id}</p><h2>{todo.title}</h2><p>Completed: {todo.completed ? 'Yes' : 'No'}</p>
        <Link className="button-link" to={`/todos/${todo.id}/edit`}>Edit todo</Link>
      </article>
    </section>
  )
}
