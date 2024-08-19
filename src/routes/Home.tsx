import { Outlet } from 'react-router-dom'
import TodoCreator from '@/components/TodoCreator'
import TodoList from '@/components/TodoList'
import TodoMessage from '@/components/TodoMessage'

export default function Home() {
  return (
    <>
      <main>
        <TodoCreator />
        <TodoList />
        <TodoMessage />
      </main>
      <Outlet />
    </>
  )
}
