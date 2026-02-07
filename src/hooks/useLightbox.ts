import { useState, useCallback } from "react";

export function useLightbox(
  totalPhotos: number,
  photoRefs: React.RefObject<Map<number, HTMLButtonElement>>,
) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const isOpen = currentIndex >= 0;

  const open = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const close = useCallback(() => {
    const returnIndex = currentIndex;
    setCurrentIndex(-1);
    requestAnimationFrame(() => {
      photoRefs.current?.get(returnIndex)?.focus();
    });
  }, [currentIndex, photoRefs]);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : totalPhotos - 1));
  }, [totalPhotos]);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i < totalPhotos - 1 ? i + 1 : 0));
  }, [totalPhotos]);

  return { currentIndex, isOpen, open, close, prev, next };
}
