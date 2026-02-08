import { useState } from "react";
import styles from "./Header.module.css";

export function Header() {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <header className={styles.sticky}>
      <div className={styles.inner}>
        <div className={styles.bar}>
          <div className={styles.left}>
            <div className={styles.title}>
              <a href="#map" className={styles.addressLink}>
                2689 Irving St, Denver, CO 80211
                <img src="/google-map-icon.svg" alt="" width="14" height="14" />
              </a>
              <span className={styles.divider} aria-hidden="true" />
              <a href="https://www.zillow.com/homedetails/2689-Irving-St-Denver-CO-80211/13311636_zpid/" target="_blank" rel="noopener noreferrer" className={styles.zillowIcon} aria-label="View on Zillow">
                <img src="/zillow-icon.png" alt="Zillow" width="18" height="18" />
              </a>
            </div>
            <div className={styles.stats}>
              <span className={styles.stat}>4 Beds</span>
              <span className={styles.divider} aria-hidden="true" />
              <span className={styles.stat}>3 Baths</span>
              <span className={styles.divider} aria-hidden="true" />
              <span className={styles.stat}>2,850 sqft</span>
              <span className={styles.divider} aria-hidden="true" />
              <span className={styles.stat}>27 Photos</span>
              <a href="/photos/2689-Irving-St-Photos.zip" download className={styles.downloadIcon} aria-label="Download all photos">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
            </div>
          </div>
          <div className={styles.center}>
            <a href="https://rlpmg.com/" target="_blank" rel="noopener noreferrer" className={styles.eyebrow}>
              Presented by RL Property Management
              <svg className={styles.externalIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
            <a href="https://www.planomatic.com" target="_blank" rel="noopener noreferrer" className={styles.produced}>
              Produced by PlanOmatic on 2/7/2026
              <svg className={styles.externalIcon} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
          </div>
          <div className={styles.right}>
          <button
            type="button"
            onClick={copyLink}
            className={styles.shareBtn}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            {copied ? "Copied!" : "Share"}
          </button>
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
      </div>
    </header>
  );
}
