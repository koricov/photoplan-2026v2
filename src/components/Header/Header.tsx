import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.sticky}>
      <div className={styles.inner}>
        <div className={styles.bar}>
          <div className={styles.left}>
            <a href="#map" className={styles.title}>
              2689 Irving St, Denver, CO 80211
              <svg className={styles.externalIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </a>
            <div className={styles.stats}>
              <span className={styles.stat}>4 Beds</span>
              <span className={styles.divider} aria-hidden="true" />
              <span className={styles.stat}>3 Baths</span>
              <span className={styles.divider} aria-hidden="true" />
              <span className={styles.stat}>2,850 sqft</span>
              <span className={styles.divider} aria-hidden="true" />
              <span className={styles.stat}>27 Photos</span>
            </div>
          </div>
          <a href="https://rlpmg.com/" target="_blank" rel="noopener noreferrer" className={styles.eyebrow}>
            Presented by RL Property Management
            <svg className={styles.externalIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
          <a
            href="#tour"
            className={styles.tourBtn}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <path d="M2 12h20" />
            </svg>
            3D Tour
          </a>
        </div>
      </div>
    </header>
  );
}
