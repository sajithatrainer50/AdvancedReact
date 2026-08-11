import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { TodoForm } from '../components/TodoForm'
import { fetchTodoById, selectDetailStatus, selectMutationStatus, selectSelectedTodo, selectTodosError, updateTodo } from '../features/todos/todosSlice'

export function EditTodoPage() {
  const { todoId } = useParams<{ todoId: string }>()
  const numericId = Number(todoId)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const todo = useAppSelector(selectSelectedTodo)
  const detailStatus = useAppSelector(selectDetailStatus)
  const mutationStatus = useAppSelector(selectMutationStatus)
  const error = useAppSelector(selectTodosError)

  useEffect(() => {
    if (Number.isInteger(numericId) && todo?.id !== numericId) void dispatch(fetchTodoById(numericId))
  }, [dispatch, numericId, todo?.id])

  if (!Number.isInteger(numericId)) return <p className="error">Invalid todo ID.</p>
  if (detailStatus === 'loading' || !todo) return <p>Loading todo...</p>

  return (
    <section>
      <h1>Edit todo</h1>
      {error && <p className="error">{error}</p>}
      <TodoForm key={todo.id} initialValues={{ title: todo.title, completed: todo.completed }} submitLabel="Save changes" disabled={mutationStatus === 'loading'} onSubmit={async (changes) => {
        await dispatch(updateTodo({ id: todo.id, changes })).unwrap()
        navigate(`/todos/${todo.id}`)
      }} />
    </section>
  )
}
