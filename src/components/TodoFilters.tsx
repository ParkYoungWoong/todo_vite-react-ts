import { useState, useEffect } from 'react'
import { useTodoStore } from '@/stores/todo'
import TheIcon from '@/components/TheIcon'
import TheButton from '@/components/TheButton'
import styles from './TodoFilters.module.scss'

export default function TodoFilters() {
  const [isAllChecked, setIsAllChecked] = useState(false)
  const todos = useTodoStore(state => state.todos)
  const filters = useTodoStore(state => state.filters)
  const filterStatus = useTodoStore(state => state.filterStatus)
  const isDeleting = useTodoStore(state => state.isLoadingForDeleteTodos)
  const setFilterStatus = useTodoStore(state => state.setFilterStatus)
  const updateTodos = useTodoStore(state => state.updateTodos)
  const deleteTodos = useTodoStore(state => state.deleteTodos)

  useEffect(() => {
    if (!todos) return
    setIsAllChecked(todos.every(todo => todo.done))
  }, [todos])

  function toggleAllCheckboxes() {
    const done = !isAllChecked
    setIsAllChecked(done)
    updateTodos(todos.map(todo => ({ ...todo, done })))
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
          loading={isDeleting}
          onClick={deleteTodos}>
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
