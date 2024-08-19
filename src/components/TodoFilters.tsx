import { useState, useEffect } from 'react'
import {
  useFetchTodos,
  useUpdateTodos,
  useTodoFilters,
  useDeleteTodos
} from '@/hooks/todo'
import TheIcon from '@/components/TheIcon'
import TheButton from '@/components/TheButton'
import styles from './TodoFilters.module.scss'

export default function TodoFilters() {
  const [isAllChecked, setIsAllChecked] = useState(false)
  const { data: todos } = useFetchTodos()
  const { mutate: mutateForUpdateTodos } = useUpdateTodos()
  const { mutate: mutateForDeleteTodos, isPending } = useDeleteTodos()
  const filterStatus = useTodoFilters(state => state.filterStatus)
  const filters = useTodoFilters(state => state.filters)
  const setFilterStatus = useTodoFilters(state => state.setFilterStatus)

  useEffect(() => {
    if (!todos) return
    setIsAllChecked(todos.every(todo => todo.done))
  }, [todos])

  function toggleAllCheckboxes() {
    const done = !isAllChecked
    setIsAllChecked(done)
    if (todos) {
      mutateForUpdateTodos(todos.map(todo => ({ ...todo, done })))
    }
  }
  function deleteAllDoneTodos() {
    if (todos) {
      mutateForDeleteTodos(todos)
    }
  }

  return (
    <div className={styles.todoFilters}>
      <div className={styles.btnGroup}>
        {filters.map(filter => (
          <TheButton
            key={filter.value}
            active={filterStatus === filter.value}
            onClick={() => setFilterStatus(filter.value)}>
            {filter.text}
          </TheButton>
        ))}
        <TheButton
          danger
          loading={isPending}
          onClick={deleteAllDoneTodos}>
          완료 삭제
        </TheButton>
      </div>
      <TheIcon
        className={styles.theIcon}
        circle
        active={isAllChecked}
        onClick={toggleAllCheckboxes}>
        done_all
      </TheIcon>
    </div>
  )
}
