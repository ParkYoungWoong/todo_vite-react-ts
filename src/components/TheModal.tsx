import styles from './TheModal.module.scss'

export default function TheModal({
  children,
  offModal = () => {}
}: {
  children: React.ReactNode
  offModal?: () => void
}) {
  return (
    <div className={styles.theModal}>
      <div
        className={styles.overlay}
        onClick={offModal}></div>
      <div className={styles.contents}>{children}</div>
    </div>
  )
}
