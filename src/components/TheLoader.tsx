import clsx from 'clsx'
import styles from './TheLoader.module.scss'

export default function TheLoader({ className }: { className?: string }) {
  return <div className={clsx(className, styles.theLoader)}></div>
}
