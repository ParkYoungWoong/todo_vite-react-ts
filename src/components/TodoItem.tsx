import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { useTodoStore } from '@/stores/todo'
import type { Todo } from '@/stores/todo'
import TheIcon from '@/components/TheIcon'
import styles from './TodoItem.module.scss'

export default function TodoItem({ todo }: { todo: Todo }) {
  const filterStatus = useTodoStore(state => state.filterStatus)
  const updateTodo = useTodoStore(state => state.updateTodo)

  function toggleDone() {
    updateTodo({
      ...todo,
      done: !todo.done
    })
  }
  return (
    <>
      <div className={styles.todoItem}>
        <TheIcon
          className={styles.theIcon}
          circle
          active={todo.done}
          onClick={toggleDone}>
          check
        </TheIcon>
        <Link
          to={`/${todo.id}`}
          className={styles.title}>
          {todo.title}
        </Link>
        <div className="flex-space"></div>
        <Link to={`/${todo.id}`}>
          <TheIcon className={styles.openHandler}>open_in_new</TheIcon>
        </Link>
        {filterStatus === 'all' && (
          <TheIcon className={clsx(styles.dragHandler, 'drag-handle')}>
            drag_indicator
          </TheIcon>
        )}
      </div>
    </>
  )
}
