import React, { useRef, useEffect } from 'react'
import Sortable from 'sortablejs'
import { useTodoStore } from '@/stores/todo'
import TodoFilters from '@/components/TodoFilters'
import TodoItem from '@/components/TodoItem'
import styles from './TodoList.module.scss'

export default function TodoList() {
  const todos = useTodoStore(state => state.filteredTodos)
  const reorderTodos = useTodoStore(state => state.reorderTodos)
  const todoListEl = useRef<HTMLDivElement>(null)
  const sortableInstance = useRef<Sortable | null>(null) // Sortable 인스턴스를 참조하는 Ref 추가

  useEffect(() => {
    if (sortableInstance.current) {
      sortableInstance.current.destroy() // 기존 인스턴스가 있다면 제거
    }

    if (todoListEl.current) {
      sortableInstance.current = new Sortable(todoListEl.current, {
        handle: '.drag-handle', // 드래그 핸들이 될 요소의 선택자를 입력
        animation: 0, // 정렬할 때 애니메이션 속도(ms)를 지정, default: 150
        forceFallback: true, // 다양한 환경의 일관된 Drag&Drop(DnD)을 위해 HTML5 기본 DnD 동작을 무시하고 내장 기능을 사용, default: false
        // 요소의 DnD가 종료되면 실행할 핸들러(함수)를 지정
        onEnd: event => {
          const { oldIndex, newIndex } = event
          if (oldIndex === undefined || newIndex === undefined) return
          console.log('oldIndex:', oldIndex, 'newIndex:', newIndex)
          reorderTodos({
            oldIndex,
            newIndex
          })
        }
      })
    }
  }, [todos])

  return (
    <div className={styles.todoContainer}>
      <TodoFilters />
      <div ref={todoListEl}>
        {todos?.map(todo => (
          <React.Fragment key={todo.id}>
            <TodoItem todo={todo}></TodoItem>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
