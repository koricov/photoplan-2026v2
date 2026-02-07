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
      {photos.map((photo, i) => (
        <div key={photo.id}>
          <PhotoCard
            photo={photo}
            onClick={() => onPhotoClick(i)}
            buttonRef={refCallback(photoRefs, i)}
          />
        </div>
      ))}
    </section>
  );
}
