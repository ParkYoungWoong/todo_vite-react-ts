import clsx from 'clsx'
import { useState } from 'react'
import { useCreateTodo, useFetchTodos } from '@/hooks/todo'
import TheLoader from '@/components/TheLoader'
import TheIcon from '@/components/TheIcon'
import styles from './TodoCreator.module.scss'

export default function TodoCreator() {
  const [title, setTitle] = useState('')
  const { mutateAsync, isPending } = useCreateTodo()
  const { isLoading } = useFetchTodos()

  function handleKeyDownEnter(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') return // 엔터키 입력 확인!
    if (event.nativeEvent.isComposing) return // 한글 중복 입력 방지!(macOS)
    createTodo()
  }
  async function createTodo() {
    if (!title.trim()) return // 빈 문자 방지!
    if (isPending) return // 연속 입력 방지!
    setTitle('')
    await mutateAsync({ title })
  }
  return (
    <div className={clsx(styles.todoCreator, 'shadow')}>
      <div className={styles.iconBox}>
        {isPending || isLoading ? (
          <TheLoader />
        ) : (
          <TheIcon
            circle
            active
            onClick={createTodo}>
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
