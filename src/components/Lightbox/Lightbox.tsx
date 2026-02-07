import { useEffect, useRef, useCallback } from "react";
import type { Photo } from "../../types/photo";
import styles from "./Lightbox.module.css";

const GAP = 20;

interface LightboxProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Lightbox({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);
  const isAnimating = useRef(false);
  const pendingOnEnd = useRef<(() => void) | null>(null);
  const currentIndexRef = useRef(currentIndex);
  const photosRef = useRef(photos);

  // Keep refs in sync with props
  currentIndexRef.current = currentIndex;
  photosRef.current = photos;

  // Fullscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (isOpen && document.fullscreenEnabled && !document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    } else if (!isOpen && document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [isOpen]);

  const handleFullscreenChange = useCallback(() => {
    if (!document.fullscreenElement && isOpen) onClose();
  }, [isOpen, onClose]);

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [handleFullscreenChange]);

  useEffect(() => {
    if (!isOpen || document.fullscreenEnabled) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Called when slide animation finishes — synchronous DOM swap, zero flicker
  const completeSlide = useCallback((direction: "left" | "right") => {
    const strip = stripRef.current;
    if (!strip) return;

    if (pendingOnEnd.current) {
      strip.removeEventListener("transitionend", pendingOnEnd.current);
      pendingOnEnd.current = null;
    }

    const p = photosRef.current;
    const idx = currentIndexRef.current;
    const newIndex = direction === "left"
      ? (idx + 1) % p.length
      : (idx - 1 + p.length) % p.length;
    const newPrev = (newIndex - 1 + p.length) % p.length;
    const newNext = (newIndex + 1) % p.length;

    // Synchronously reset transform AND swap image sources in the same microtask.
    // This guarantees both changes land in the same paint frame — no flicker possible.
    strip.style.transition = "none";
    strip.style.transform = "translateX(0)";

    const images = strip.querySelectorAll("img");
    images[0].src = p[newPrev].fullUrl;
    images[0].alt = p[newPrev].alt;
    images[1].src = p[newIndex].fullUrl;
    images[1].alt = p[newIndex].alt;
    images[2].src = p[newNext].fullUrl;
    images[2].alt = p[newNext].alt;

    const captions = strip.querySelectorAll("span");
    captions[0].textContent = p[newPrev].alt;
    captions[1].textContent = p[newIndex].alt;
    captions[2].textContent = p[newNext].alt;

    // Sync React state — DOM already matches, so re-render is a visual no-op
    if (direction === "left") onNext();
    else onPrev();

    isAnimating.current = false;
  }, [onNext, onPrev]);

  const animateSlide = useCallback((direction: "left" | "right") => {
    const strip = stripRef.current;
    if (!strip || isAnimating.current) return;
    isAnimating.current = true;

    const width = strip.parentElement!.offsetWidth;
    const target = direction === "left" ? -(width + GAP) : (width + GAP);

    strip.style.transition = "transform 300ms cubic-bezier(0.25, 0.1, 0.25, 1)";
    strip.style.transform = `translateX(${target}px)`;

    const onEnd = () => completeSlide(direction);
    pendingOnEnd.current = onEnd;
    strip.addEventListener("transitionend", onEnd, { once: true });
  }, [completeSlide]);

  // Keyboard
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") { e.preventDefault(); animateSlide("right"); }
      if (e.key === "ArrowRight") { e.preventDefault(); animateSlide("left"); }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, animateSlide]);

  // Touch
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isAnimating.current) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isAnimating.current) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;

    if (!isSwiping.current && Math.abs(dx) > 10) {
      isSwiping.current = Math.abs(dx) > Math.abs(dy);
      if (!isSwiping.current) return;
    }

    if (isSwiping.current) {
      e.preventDefault();
      const strip = stripRef.current;
      if (strip) {
        strip.style.transition = "none";
        strip.style.transform = `translateX(${dx}px)`;
      }
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isSwiping.current || isAnimating.current) return;
    isSwiping.current = false;

    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const strip = stripRef.current;
    if (!strip) return;

    if (Math.abs(dx) > 50) {
      isAnimating.current = true;
      const width = strip.parentElement!.offsetWidth;
      const target = dx < 0 ? -(width + GAP) : (width + GAP);
      const direction: "left" | "right" = dx < 0 ? "left" : "right";

      strip.style.transition = "transform 300ms cubic-bezier(0.25, 0.1, 0.25, 1)";
      strip.style.transform = `translateX(${target}px)`;

      const onEnd = () => completeSlide(direction);
      pendingOnEnd.current = onEnd;
      strip.addEventListener("transitionend", onEnd, { once: true });
    } else {
      strip.style.transition = "transform 200ms ease";
      strip.style.transform = "translateX(0)";
    }
  }, [completeSlide]);

  // Preload adjacent
  useEffect(() => {
    if (!isOpen) return;
    const nextIdx = (currentIndex + 1) % photos.length;
    const prevIdx = (currentIndex - 1 + photos.length) % photos.length;
    const images = [photos[nextIdx].fullUrl, photos[prevIdx].fullUrl].map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });
    return () => { images.forEach((img) => { img.src = ""; }); };
  }, [isOpen, currentIndex, photos]);

  if (!isOpen) {
    return <div ref={containerRef} className={styles.viewer} />;
  }

  const prevIdx = (currentIndex - 1 + photos.length) % photos.length;
  const nextIdx = (currentIndex + 1) % photos.length;

  return (
    <div ref={containerRef} className={`${styles.viewer} ${styles.viewerOpen}`}>
      <div className={styles.topBar}>
        <span className={styles.counter}>
          {currentIndex + 1} / {photos.length}
        </span>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close viewer" type="button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div
        className={styles.imageArea}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={() => animateSlide("right")} aria-label="Previous photo" type="button">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div ref={stripRef} className={styles.strip}>
          <img src={photos[prevIdx].fullUrl} alt={photos[prevIdx].alt} className={styles.image} style={{ left: `calc(-100% - ${GAP}px)` }} />
          <span className={styles.caption} style={{ left: `calc(-100% - ${GAP}px)` }}>{photos[prevIdx].alt}</span>
          <img src={photos[currentIndex].fullUrl} alt={photos[currentIndex].alt} className={styles.image} style={{ left: 0 }} />
          <span className={styles.caption} style={{ left: 0 }}>{photos[currentIndex].alt}</span>
          <img src={photos[nextIdx].fullUrl} alt={photos[nextIdx].alt} className={styles.image} style={{ left: `calc(100% + ${GAP}px)` }} />
          <span className={styles.caption} style={{ left: `calc(100% + ${GAP}px)` }}>{photos[nextIdx].alt}</span>
        </div>

        <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={() => animateSlide("left")} aria-label="Next photo" type="button">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
