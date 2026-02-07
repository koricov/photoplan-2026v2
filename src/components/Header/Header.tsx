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
      <a
        href="https://www.planomatic.com"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.tourBtn}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
        3D Tour
      </a>
    </header>
  );
}
