import type { ReactNode } from "react";
import type { Photo } from "../../types/photo";
import { PhotoCard } from "../PhotoCard/PhotoCard";
import styles from "./PhotoGrid.module.css";

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
  photoRefs: React.RefObject<Map<number, HTMLButtonElement>>;
  mapSlot?: ReactNode;
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

export function PhotoGrid({ photos, onPhotoClick, photoRefs, mapSlot }: PhotoGridProps) {
  const topPhotos = photos.slice(0, 3);
  const restPhotos = photos.slice(3);

  return (
    <section className={styles.grid} aria-label="Property photos">
      <div className={styles.topRow}>
        {topPhotos.map((photo, i) => (
          <div key={photo.id}>
            <PhotoCard
              photo={photo}
              onClick={() => onPhotoClick(i)}
              buttonRef={refCallback(photoRefs, i)}
            />
          </div>
        ))}
        {mapSlot && <div>{mapSlot}</div>}
      </div>

      {restPhotos.map((photo, i) => {
        const index = i + 3;
        return (
          <div key={photo.id}>
            <PhotoCard
              photo={photo}
              onClick={() => onPhotoClick(index)}
              buttonRef={refCallback(photoRefs, index)}
            />
          </div>
        );
      })}
    </section>
  );
}
