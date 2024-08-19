import { useMemo } from 'react'
import { useFetchTodos, useTodoFilters } from '@/hooks/todo'
import styles from './TodoMessage.module.scss'

export default function TodoMessage() {
  const { data: todos } = useFetchTodos()
  const filterStatus = useTodoFilters(state => state.filterStatus)

  const message = useMemo(() => {
    if (!todos) {
      return '로딩 중입니다..'
    }
    if (!todos.length) {
      return '당신의 할 일을 작성해 보세요!'
    }
    if (filterStatus === 'all') {
      return '목록을 재정렬하려면, 드래그 앤 드롭을 하세요~'
    }
    return '매일 할 일을 확인하세요!'
  }, [todos, filterStatus])

  return <div className={styles.todoMessage}>{message}</div>
}
