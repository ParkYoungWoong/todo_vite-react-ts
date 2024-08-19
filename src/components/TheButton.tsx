import clsx from 'clsx'
import TheLoader from '@/components/TheLoader'
import styles from './TheButton.module.scss'

interface TheButtonProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  active?: boolean
  success?: boolean
  danger?: boolean
  loading?: boolean
}

export default function TheButton({
  children,
  active,
  success,
  danger,
  loading,
  ...rest
}: TheButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        styles.theButton,
        rest.className,
        active && styles.active,
        loading && styles.loading,
        success && styles.success,
        danger && styles.danger
      )}>
      {loading ? <TheLoader className={styles.theLoader} /> : children}
    </button>
  )
}
