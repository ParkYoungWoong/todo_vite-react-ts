import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useTodoStore } from '@/stores/todo'
import TheLoader from '@/components/TheLoader'
import TheIcon from '@/components/TheIcon'
import styles from './TodoCreator.module.scss'

export default function TodoCreator() {
  const [title, setTitle] = useState('')
  const fetchTodos = useTodoStore(state => state.fetchTodos)
  const createTodo = useTodoStore(state => state.createTodo)
  const isCreating = useTodoStore(state => state.isLoadingForCreateTodo)
  const isFetching = useTodoStore(state => state.isLoadingForFetchTodos)

  useEffect(() => {
    fetchTodos()
  }, [])

  function handleKeyDownEnter(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') return // 엔터키 입력 확인!
    if (event.nativeEvent.isComposing) return // 한글 중복 입력 방지!(macOS)
    handleCreateTodo()
  }
  async function handleCreateTodo() {
    if (!title.trim()) return // 빈 문자 방지!
    if (isCreating) return // 연속 입력 방지!
    setTitle('')
    await createTodo({ title })
  }
  return (
    <div className={clsx(styles.todoCreator, 'shadow')}>
      <div className={styles.iconBox}>
        {isCreating || isFetching ? (
          <TheLoader />
        ) : (
          <TheIcon
            circle
            active
            onClick={handleCreateTodo}>
            add
          </TheIcon>
        )}
      </div>
      <input
        value={title}
        className={styles.input}
        placeholder="새로운 할 일을 작성하세요~"
        onChange={e => setTitle(e.target.value)}
        onKeyDown={handleKeyDownEnter}
      />
    </div>
  )
}
