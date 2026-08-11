import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { createTodoApi, deleteTodoApi, getTodoApi, getTodosApi, updateTodoApi } from './todosApi'
import type { NewTodo, Todo, TodosState, UpdateTodoInput } from './types'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unknown error occurred'
}

export const fetchTodos = createAsyncThunk<Todo[], void, { rejectValue: string }>(
  'todos/fetchTodos',
  async (_, thunkApi) => {
    try {
      return await getTodosApi()
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error))
    }
  },
)

export const fetchTodoById = createAsyncThunk<Todo, number, { rejectValue: string }>(
  'todos/fetchTodoById',
  async (todoId, thunkApi) => {
    try {
      return await getTodoApi(todoId)
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error))
    }
  },
)

export const createTodo = createAsyncThunk<Todo, NewTodo, { rejectValue: string }>(
  'todos/createTodo',
  async (newTodo, thunkApi) => {
    try {
      return await createTodoApi(newTodo)
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error))
    }
  },
)

export const updateTodo = createAsyncThunk<Todo, UpdateTodoInput, { rejectValue: string }>(
  'todos/updateTodo',
  async (input, thunkApi) => {
    try {
      return await updateTodoApi(input)
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error))
    }
  },
)

export const deleteTodo = createAsyncThunk<number, number, { rejectValue: string }>(
  'todos/deleteTodo',
  async (todoId, thunkApi) => {
    try {
      return await deleteTodoApi(todoId)
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error))
    }
  },
)

const initialState: TodosState = {
  items: [],
  selectedTodo: null,
  listStatus: 'idle',
  detailStatus: 'idle',
  mutationStatus: 'idle',
  error: null,
}

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    selectedTodoCleared(state) {
      state.selectedTodo = null
      state.detailStatus = 'idle'
    },
    errorCleared(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.listStatus = 'loading'
        state.error = null
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.listStatus = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.listStatus = 'failed'
        state.error = action.payload ?? action.error.message ?? 'Could not load todos'
      })
      .addCase(fetchTodoById.pending, (state) => {
        state.detailStatus = 'loading'
        state.error = null
      })
      .addCase(fetchTodoById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded'
        state.selectedTodo = action.payload
      })
      .addCase(fetchTodoById.rejected, (state, action) => {
        state.detailStatus = 'failed'
        state.error = action.payload ?? action.error.message ?? 'Could not load the todo'
      })
      .addCase(createTodo.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items.unshift(action.payload)
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload ?? action.error.message ?? 'Could not create the todo'
      })
      .addCase(updateTodo.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        const index = state.items.findIndex((todo) => todo.id === action.payload.id)
        if (index >= 0) state.items[index] = action.payload
        if (state.selectedTodo?.id === action.payload.id) state.selectedTodo = action.payload
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload ?? action.error.message ?? 'Could not update the todo'
      })
      .addCase(deleteTodo.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items = state.items.filter((todo) => todo.id !== action.payload)
        if (state.selectedTodo?.id === action.payload) state.selectedTodo = null
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload ?? action.error.message ?? 'Could not delete the todo'
      })
  },
})

export const { selectedTodoCleared, errorCleared } = todosSlice.actions
export default todosSlice.reducer

export const selectTodosState = (state: RootState): TodosState => state.todos
export const selectTodos = (state: RootState): Todo[] => state.todos.items
export const selectSelectedTodo = (state: RootState): Todo | null => state.todos.selectedTodo
export const selectListStatus = (state: RootState) => state.todos.listStatus
export const selectDetailStatus = (state: RootState) => state.todos.detailStatus
export const selectMutationStatus = (state: RootState) => state.todos.mutationStatus
export const selectTodosError = (state: RootState) => state.todos.error
export const selectCompletedCount = createSelector([selectTodos], (todos) => todos.filter((todo) => todo.completed).length)
