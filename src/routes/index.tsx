import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './Home'
import TodoItemDetails from './TodoItemDetails'

export default function Index() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes
        location={location}
        key={location.pathname}>
        <Route
          path="/"
          element={<Home />}>
          <Route
            path="/:id"
            element={<TodoItemDetails />}
          />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
