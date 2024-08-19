import { motion } from 'framer-motion'
import TodoItemForModal from '@/components/TodoItemForModal'

export default function TodoItemDetails() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, position: 'relative', zIndex: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}>
      <TodoItemForModal />
    </motion.div>
  )
}
