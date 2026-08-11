import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { TodoForm } from '../components/TodoForm'
import { createTodo, selectMutationStatus, selectTodosError } from '../features/todos/todosSlice'

export function CreateTodoPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const status = useAppSelector(selectMutationStatus)
  const error = useAppSelector(selectTodosError)

  return (
    <section>
      <h1>Create todo</h1>
      {error && <p className="error">{error}</p>}
      <TodoForm submitLabel="Create" disabled={status === 'loading'} onSubmit={async (values) => {
        await dispatch(createTodo({ userId: 1, ...values })).unwrap()
        navigate('/todos')
      }} />
    </section>
  )
}
