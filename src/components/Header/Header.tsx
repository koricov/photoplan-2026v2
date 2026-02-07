import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <a href="https://rlpmg.com/" target="_blank" rel="noopener noreferrer" className={styles.eyebrow}>Managed by RL Property Management</a>
      <h1 className={styles.title}>2689 Irving St</h1>
      <p className={styles.address}>Denver, CO 80211</p>
      <div className={styles.stats}>
        <span className={styles.stat}>4 Beds</span>
        <span className={styles.divider} aria-hidden="true" />
        <span className={styles.stat}>3 Baths</span>
        <span className={styles.divider} aria-hidden="true" />
        <span className={styles.stat}>2,850 sqft</span>
      </div>
    </header>
  );
}
