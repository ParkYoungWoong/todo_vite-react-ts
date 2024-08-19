import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFetchTodos, useUpdateTodo, useDeleteTodo } from '@/hooks/todo'
import TheIcon from '@/components/TheIcon'
import TheButton from '@/components/TheButton'
import TheModal from '@/components/TheModal'
import stylesFilters from './TodoFilters.module.scss'
import styles from './TodoItemForModal.module.scss'

function formatDate(date: string | undefined) {
  return dayjs(date).format('YYYY년 M월 D일 H시 m분')
}

export default function TodoItemForModal() {
  const navigate = useNavigate()
  const { id: todoId } = useParams()
  const { data: todos } = useFetchTodos()
  const { mutateAsync: mutateForUpdate, isPending: isPendingForUpdate } =
    useUpdateTodo()
  const { mutateAsync: mutateForDelete, isPending: isPendingForDelete } =
    useDeleteTodo()

  const currentTodo = todos?.find(todo => todo.id === todoId)
  const [title, setTitle] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (currentTodo) {
      setTitle(currentTodo.title)
      setDone(currentTodo.done)
    }
  }, [currentTodo])

  async function updateTodo() {
    if (currentTodo) {
      await mutateForUpdate({
        ...currentTodo,
        title,
        done
      })
      offModal()
    }
  }
  async function deleteTodo() {
    if (currentTodo) {
      await mutateForDelete(currentTodo)
      offModal()
    }
  }
  function toggleDone() {
    setDone(done => !done)
  }
  function offModal() {
    navigate('/')
  }
  function onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setTitle(event.target.value)
  }
  return (
    <TheModal offModal={offModal}>
      <div className={stylesFilters.todoFilters}>
        <TheIcon
          circle
          className={stylesFilters.theIcon}
          active={done}
          onClick={toggleDone}>
          check
        </TheIcon>
        <div className={stylesFilters.btnGroup}>
          <TheButton onClick={offModal}>취소</TheButton>
          <TheButton
            danger
            loading={isPendingForDelete}
            onClick={deleteTodo}>
            삭제
          </TheButton>
          <TheButton
            success
            loading={isPendingForUpdate}
            onClick={updateTodo}>
            저장
          </TheButton>
        </div>
      </div>
      <div className={styles.dateGroup}>
        <div className={styles.date}>
          생성: {formatDate(currentTodo?.createdAt)}
        </div>
        {currentTodo?.createdAt !== currentTodo?.updatedAt && (
          <>
            <div className={styles.date}>|</div>
            <div className={styles.date}>
              수정: {formatDate(currentTodo?.updatedAt)}
            </div>
          </>
        )}
      </div>
      <textarea
        className={styles.editor}
        value={title || ''}
        onChange={onChange}
      />
    </TheModal>
  )
}
