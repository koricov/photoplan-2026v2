import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
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
    </footer>
  );
}
