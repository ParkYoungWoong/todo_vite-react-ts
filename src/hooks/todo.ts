import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { create } from 'zustand'

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

function request({ method, endpoint, data }: RequestBody) {
  return axios.post('/api/todos', {
    method,
    endpoint,
    data
  })
}

export const useTodoFilters = create<{
  filterStatus: FilterStatus
  filters: Filters
  setFilterStatus: (status: FilterStatus) => void
}>(set => ({
  filterStatus: 'all',
  filters: [
    { text: '전체', value: 'all' },
    { text: '할 일', value: 'todo' },
    { text: '완료', value: 'done' }
  ],
  setFilterStatus(status) {
    set({
      filterStatus: status
    })
  }
}))

export const useFetchTodos = () => {
  const filterStatus = useTodoFilters(state => state.filterStatus)
  return useQuery<Todos>({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data } = await request({
        method: 'GET'
      })
      return data as Todos
    },
    staleTime: 1000 * 60 * 5, // 5분
    select: todos => {
      return todos.filter(todo => {
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
    }
  })
}

export const useCreateTodo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (todo: Pick<Todo, 'title'>) => {
      const { data } = await request({
        method: 'POST',
        data: todo
      })
      return data
    },
    onMutate: async todo => {
      // 낙관적 업데이트 전에 중복될 수 있는 쿼리를 모두 취소해 잠재적인 충돌 방지!
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      // 캐시된 데이터(사용자 목록) 가져오기!
      const previousTodos = queryClient.getQueryData<Todos>(['todos'])
      // 낙관적 업데이트!
      if (previousTodos) {
        queryClient.setQueryData<Todos>(
          ['todos'],
          [{ id: Math.random().toString(), ...todo } as Todo, ...previousTodos]
        )
      }
      // 각 콜백의 context로 전달할 데이터 반환!
      return { previousTodos }
    },
    onSuccess: () => {
      // 변이 성공 시 캐시 무효화로 목록 데이터 갱신!
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (_error, _payload, context) => {
      // 변이 실패 시, 낙관적 업데이트 결과를 이전 사용자 목록으로 되돌리기!
      if (context && context.previousTodos) {
        queryClient.setQueryData(['users'], context.previousTodos)
      }
    }
  })
}

export const useUpdateTodo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (todo: Todo) => {
      const { data } = await request({
        method: 'PUT',
        endpoint: todo.id,
        data: todo
      })
      return data as Todo
    },
    onMutate: async todo => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previousTodos = queryClient.getQueryData<Todos>(['todos'])
      if (previousTodos) {
        // 수정할 할 일로 교체한, 새로운 할 일 목록 생성!
        const cloneTodos = previousTodos.map(pTodo => {
          return pTodo.id === todo.id ? todo : pTodo
        })
        queryClient.setQueryData<Todos>(['todos'], cloneTodos)
      }
      return { previousTodos }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (_error, _payload, context) => {
      if (context && context.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    }
  })
}

export const useDeleteTodo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (todo: Todo) => {
      const { data } = await request({
        method: 'DELETE',
        endpoint: todo.id
      })
      return data as Todo
    },
    onMutate: async todo => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previousTodos = queryClient.getQueryData<Todos>(['todos'])
      if (previousTodos) {
        const cloneTodos = previousTodos.filter(pTodo => pTodo.id !== todo.id)
        queryClient.setQueryData<Todos>(['todos'], cloneTodos)
      }
      return { previousTodos }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (_error, _payload, context) => {
      if (context && context.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    }
  })
}

export const useUpdateTodos = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (todos: Todos) => {
      const { data } = await request({
        method: 'PUT',
        endpoint: 'updations',
        data: {
          todos
        }
      })
      return data as boolean
    },
    onMutate: async todos => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previousTodos = queryClient.getQueryData<Todos>(['todos'])
      if (previousTodos) {
        const cloneTodos = previousTodos.map(pTodo => {
          const todoToUpdate = todos.find(todo => todo.id === pTodo.id)
          return todoToUpdate || pTodo
        })
        queryClient.setQueryData<Todos>(['todos'], cloneTodos)
      }
      return { previousTodos }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (_error, _payload, context) => {
      if (context && context.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    }
  })
}

export const useDeleteTodos = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (todos: Todos) => {
      const todoIds =
        todos?.filter(todo => todo.done).map(todo => todo.id) || []
      if (!todoIds.length) throw new Error('삭제할 할 일 목록이 없습니다.')
      const { data } = await request({
        method: 'DELETE',
        endpoint: 'deletions',
        data: {
          todoIds
        }
      })
      return data as boolean
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previousTodos = queryClient.getQueryData<Todos>(['todos'])
      if (previousTodos) {
        const cloneTodos = previousTodos.filter(todo => !todo.done)
        queryClient.setQueryData<Todos>(['todos'], cloneTodos)
      }
      return { previousTodos }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (_error, _payload, context) => {
      if (context && context.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    }
  })
}

export const useReorderTodos = () => {
  const queryClient = useQueryClient()
  const { data: todos } = useFetchTodos()
  return useMutation({
    mutationFn: async ({
      oldIndex,
      newIndex
    }: {
      oldIndex: number
      newIndex: number
    }) => {
      if (oldIndex === newIndex || !todos) return
      const todoIds = todos.map(todo => todo.id)
      const [removed] = todoIds.splice(oldIndex, 1)
      todoIds.splice(newIndex, 0, removed)
      const { data } = await request({
        method: 'PUT',
        endpoint: 'reorder',
        data: {
          todoIds
        }
      })
      return data as boolean
    },
    onMutate: async ({ oldIndex, newIndex }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previousTodos = queryClient.getQueryData<Todos>(['todos'])
      if (previousTodos) {
        const cloneTodos = [...previousTodos]
        const [removed] = cloneTodos.splice(oldIndex, 1)
        cloneTodos.splice(newIndex, 0, removed)
        queryClient.setQueryData<Todos>(['todos'], cloneTodos)
      }
      return { previousTodos }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (_error, _payload, context) => {
      if (context && context.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    }
  })
}
