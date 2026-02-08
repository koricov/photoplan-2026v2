import type { Photo } from "../../types/photo";
import { PhotoCard } from "../PhotoCard/PhotoCard";
import styles from "./PhotoGrid.module.css";

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
  photoRefs: React.RefObject<Map<number, HTMLButtonElement>>;
}

function refCallback(
  photoRefs: React.RefObject<Map<number, HTMLButtonElement>>,
  index: number,
) {
  return (el: HTMLButtonElement | null) => {
    if (el) {
      photoRefs.current!.set(index, el);
    } else {
      photoRefs.current!.delete(index);
    }
  };
}

export function PhotoGrid({ photos, onPhotoClick, photoRefs }: PhotoGridProps) {
  return (
    <section className={styles.grid} aria-label="Property photos">
      <button
        className={styles.hero}
        onClick={() => onPhotoClick(0)}
        ref={refCallback(photoRefs, 0)}
        type="button"
        style={{ aspectRatio: undefined }}
      >
        <img
          src={photos[0].fullUrl}
          alt={photos[0].alt}
          className={styles.heroImg}
          fetchPriority="high"
        />
        <span className={styles.heroCaption}>{photos[0].alt}</span>
      </button>
      {photos.slice(1).map((photo, i) => (
        <div key={photo.id}>
          <PhotoCard
            photo={photo}
            onClick={() => onPhotoClick(i + 1)}
            buttonRef={refCallback(photoRefs, i + 1)}
            eager={i < 4}
          />
        </div>
      ))}
    </section>
  );
}
