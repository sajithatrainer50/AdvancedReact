import { useState, type FormEvent } from 'react'

interface TodoFormValues {
  title: string
  completed: boolean
}

interface TodoFormProps {
  initialValues?: TodoFormValues
  submitLabel: string
  disabled?: boolean
  onSubmit: (values: TodoFormValues) => Promise<void>
}

export function TodoForm({ initialValues, submitLabel, disabled = false, onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [completed, setCompleted] = useState(initialValues?.completed ?? false)
  const [validationError, setValidationError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) {
      setValidationError('Please enter a title.')
      return
    }
    setValidationError('')
    await onSubmit({ title: title.trim(), completed })
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <label>
        Todo title
        <input value={title} onChange={(event) => setTitle(event.target.value)} disabled={disabled} />
      </label>
      <label className="checkbox-row">
        <input type="checkbox" checked={completed} onChange={(event) => setCompleted(event.target.checked)} disabled={disabled} />
        Completed
      </label>
      {validationError && <p className="error">{validationError}</p>}
      <button type="submit" disabled={disabled}>{disabled ? 'Saving...' : submitLabel}</button>
    </form>
  )
}
