export interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

export interface NewTodo {
  userId: number
  title: string
  completed: boolean
}

export interface UpdateTodoInput {
  id: number
  changes: Partial<Pick<Todo, 'title' | 'completed'>>
}

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface TodosState {
  items: Todo[]
  selectedTodo: Todo | null
  listStatus: RequestStatus
  detailStatus: RequestStatus
  mutationStatus: RequestStatus
  error: string | null
}
