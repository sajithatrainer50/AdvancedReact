import type { NewTodo, Todo, UpdateTodoInput } from './types'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as T
}

export function getTodosApi(): Promise<Todo[]> {
  return request<Todo[]>('/todos?_limit=12')
}

export function getTodoApi(todoId: number): Promise<Todo> {
  return request<Todo>(`/todos/${todoId}`)
}

export function createTodoApi(todo: NewTodo): Promise<Todo> {
  return request<Todo>('/todos', {
    method: 'POST',
    body: JSON.stringify(todo),
  })
}

export function updateTodoApi(input: UpdateTodoInput): Promise<Todo> {
  return request<Todo>(`/todos/${input.id}`, {
    method: 'PATCH',
    body: JSON.stringify(input.changes),
  })
}

export async function deleteTodoApi(todoId: number): Promise<number> {
  await request<Record<string, never>>(`/todos/${todoId}`, { method: 'DELETE' })
  return todoId
}
