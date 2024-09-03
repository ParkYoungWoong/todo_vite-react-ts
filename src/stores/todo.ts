import axios from 'axios'
import { create } from 'zustand'
import { combine, subscribeWithSelector } from 'zustand/middleware'

export type Todos = Todo[]
export interface Todo {
  id: string // 할 일 ID
  order: number // 할 일 순서
  title: string // 할 일 제목
  done: boolean // 할 일 완료 여부
  createdAt: string // 할 일 생성일
  updatedAt: string // 할 일 수정일
}
type FilterStatus = 'all' | 'todo' | 'done'
type Filters = Filter[]
interface Filter {
  text: string
  value: FilterStatus
}
interface RequestBody {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  endpoint?: string
  data?: unknown
}

function request<T>({ method, endpoint, data }: RequestBody) {
  return axios.post<T>('/api/todos', {
    method,
    endpoint,
    data
  })
}

export const useTodoStore = create(
  subscribeWithSelector(
    combine(
      {
        todos: [] as Todos,
        filteredTodos: [] as Todos,
        filterStatus: 'all' as FilterStatus,
        filters: [
          { text: '전체', value: 'all' },
          { text: '할 일', value: 'todo' },
          { text: '완료', value: 'done' }
        ] as Filters,
        isLoadingForFetchTodos: false,
        isLoadingForCreateTodo: false,
        isLoadingForUpdateTodo: false,
        isLoadingForDeleteTodo: false,
        isLoadingForDeleteTodos: false
      },
      (set, get) => {
        function setFilterStatus(status: FilterStatus) {
          set({
            filterStatus: status
          })
        }
        async function fetchTodos() {
          set({ isLoadingForFetchTodos: true })
          const { data: todos } = await request<Todos>({
            method: 'GET'
          })
          set({
            todos,
            isLoadingForFetchTodos: false
          })
          return todos
        }
        async function createTodo(todo: Pick<Todo, 'title'>) {
          set({ isLoadingForCreateTodo: true })
          const { data } = await request<Todo>({
            method: 'POST',
            data: todo
          })
          await fetchTodos()
          set({ isLoadingForCreateTodo: false })
          return data
        }
        async function updateTodo(todo: Todo) {
          set(state => {
            return {
              // 낙관적 업데이트
              todos: state.todos.map(t => {
                if (t.id === todo.id) return todo
                return t
              }),
              isLoadingForUpdateTodo: true
            }
          })
          const { data } = await request({
            method: 'PUT',
            endpoint: todo.id,
            data: todo
          })
          set({ isLoadingForUpdateTodo: false })
          return data
        }
        async function deleteTodo(todo: Todo) {
          set({ isLoadingForDeleteTodo: true })
          const { data } = await request({
            method: 'DELETE',
            endpoint: todo.id
          })
          await fetchTodos()
          set({ isLoadingForDeleteTodo: false })
          return data
        }
        async function updateTodos(todos: Todos) {
          set({ isLoadingForFetchTodos: true })
          const { data } = await request({
            method: 'PUT',
            endpoint: 'updations',
            data: {
              todos
            }
          })
          await fetchTodos()
          set({ isLoadingForFetchTodos: false })
          return data
        }
        async function deleteTodos() {
          const todos = get().todos
          const todoIds =
            todos?.filter(todo => todo.done).map(todo => todo.id) || []
          if (!todoIds.length) throw new Error('삭제할 할 일 목록이 없습니다.')
          set(state => {
            return {
              // 낙관적 업데이트
              todos: state.todos.filter(todo => !todo.done),
              isLoadingForDeleteTodos: true
            }
          })
          const { data } = await request({
            method: 'DELETE',
            endpoint: 'deletions',
            data: {
              todoIds
            }
          })
          set({ isLoadingForDeleteTodos: false })
          return data
        }
        async function reorderTodos({
          oldIndex,
          newIndex
        }: {
          oldIndex: number
          newIndex: number
        }) {
          const todos = get().todos
          if (oldIndex === newIndex || !todos) return
          const todoIds = todos.map(todo => todo.id)
          const [removed] = todoIds.splice(oldIndex, 1)
          todoIds.splice(newIndex, 0, removed)
          await request({
            method: 'PUT',
            endpoint: 'reorder',
            data: {
              todoIds
            }
          })
          await fetchTodos()
        }

        return {
          setFilterStatus,
          fetchTodos,
          createTodo,
          updateTodo,
          deleteTodo,
          updateTodos,
          deleteTodos,
          reorderTodos
        }
      }
    )
  )
)

useTodoStore.subscribe(state => state.todos, updateFilteredTodos)
useTodoStore.subscribe(state => state.filterStatus, updateFilteredTodos)

function updateFilteredTodos() {
  const { todos, filterStatus } = useTodoStore.getState()
  useTodoStore.setState({
    filteredTodos: todos.filter(todo => {
      switch (filterStatus) {
        case 'todo':
          return !todo.done
        case 'done':
          return todo.done
        case 'all':
        default:
          return true
      }
    })
  })
}
