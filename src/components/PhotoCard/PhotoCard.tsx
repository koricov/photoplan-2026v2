import { useState } from "react";
import type { Photo } from "../../types/photo";
import styles from "./PhotoCard.module.css";

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
  buttonRef?: React.Ref<HTMLButtonElement>;
}

export function PhotoCard({ photo, onClick, buttonRef }: PhotoCardProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      ref={buttonRef}
      className={styles.card}
      onClick={onClick}
      type="button"
      style={{ aspectRatio: photo.aspectRatio }}
    >
      <img
        src={photo.thumbUrl}
        alt={photo.alt}
        loading="lazy"
        className={`${styles.image} ${loaded ? styles.imageLoaded : ""}`}
        onLoad={() => setLoaded(true)}
      />
      <span className={styles.caption}>{photo.alt}</span>
    </button>
  );
}
