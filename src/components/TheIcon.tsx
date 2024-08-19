import clsx from 'clsx'
import styles from './TheIcon.module.scss'

interface TheIconProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  active?: boolean
  circle?: boolean
}

export default function TheIcon({
  children,
  active,
  circle,
  ...rest
}: TheIconProps) {
  return (
    <div
      {...rest}
      className={clsx(
        styles.theIcon,
        rest.className,
        active && styles.active,
        circle && styles.circle
      )}>
      <span className={clsx(styles.icon, 'material-symbols-outlined')}>
        {children}
      </span>
    </div>
  )
}
