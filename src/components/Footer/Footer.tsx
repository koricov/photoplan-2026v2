import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <span className={styles.poweredBy}>powered by</span>
        <a
          href="https://www.planomatic.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.logoLink}
        >
          <img
            src="/planomatic-logo.png"
            alt="PlanOmatic"
            className={styles.logo}
          />
        </a>
      </div>
      <div className={styles.deliverables}>
        <span className={styles.deliverable}>&#10003; 27 HD Photos</span>
        <span className={styles.deliverable}>&#10003; 3D Interactive Tour</span>
        <span className={styles.deliverable}>&#10003; 3 Virtual Stagings</span>
        <span className={styles.deliverable}>&#10003; Floor Plan</span>
      </div>
    </footer>
  );
}
