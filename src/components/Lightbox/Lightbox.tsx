import { useEffect, useRef, useCallback, useState } from "react";
import type { Photo } from "../../types/photo";
import {
  ROOM_TYPES,
  STYLES,
  detectRoomType,
  stagePhoto,
} from "../../services/virtualStaging";
import type { RoomType, Style } from "../../services/virtualStaging";
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

  // Virtual staging state
  const [stagedUrls, setStagedUrls] = useState<Map<number, string>>(new Map());
  const [showStaged, setShowStaged] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [isStaging, setIsStaging] = useState(false);
  const [stageError, setStageError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomType>("living");
  const [selectedStyle, setSelectedStyle] = useState<Style>("modern");

  // Keep refs in sync with props
  currentIndexRef.current = currentIndex;
  photosRef.current = photos;

  // Reset staging UI on slide navigation
  useEffect(() => {
    setShowPanel(false);
    setStageError(null);
    // If this photo has been staged, show staged by default; otherwise original
    setShowStaged(stagedUrls.has(currentIndex));
    // Auto-detect room type from alt text
    setSelectedRoom(detectRoomType(photos[currentIndex]?.alt ?? ""));
  }, [currentIndex, photos, stagedUrls]);

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

  // Toggle between original/staged via DOM (matches existing strip pattern)
  const applyToggle = useCallback((staged: boolean) => {
    const strip = stripRef.current;
    if (!strip) return;
    const centerImg = strip.querySelectorAll("img")[1];
    if (!centerImg) return;

    const idx = currentIndexRef.current;
    const stagedUrl = stagedUrls.get(idx);
    if (staged && stagedUrl) {
      centerImg.src = stagedUrl;
    } else {
      centerImg.src = photosRef.current[idx].fullUrl;
    }
    setShowStaged(staged);
  }, [stagedUrls]);

  // Handle staging request
  const handleStageIt = useCallback(async () => {
    setIsStaging(true);
    setShowPanel(false);
    setStageError(null);

    const photo = photosRef.current[currentIndexRef.current];
    const imageUrl = `${window.location.origin}${photo.fullUrl}`;

    try {
      const result = await stagePhoto(imageUrl, selectedRoom, selectedStyle);
      const idx = currentIndexRef.current;
      setStagedUrls((prev) => {
        const next = new Map(prev);
        next.set(idx, result.result_image_url);
        return next;
      });
      // Show the staged result immediately via DOM
      const strip = stripRef.current;
      if (strip) {
        const centerImg = strip.querySelectorAll("img")[1];
        if (centerImg) centerImg.src = result.result_image_url;
      }
      setShowStaged(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Staging failed";
      setStageError(msg);
    } finally {
      setIsStaging(false);
    }
  }, [selectedRoom, selectedStyle]);

  // Auto-dismiss error toast
  useEffect(() => {
    if (!stageError) return;
    const timer = setTimeout(() => setStageError(null), 3000);
    return () => clearTimeout(timer);
  }, [stageError]);

  if (!isOpen) {
    return <div ref={containerRef} className={styles.viewer} />;
  }

  const prevIdx = (currentIndex - 1 + photos.length) % photos.length;
  const nextIdx = (currentIndex + 1) % photos.length;
  const hasStaged = stagedUrls.has(currentIndex);

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

        {/* Virtual Stage button */}
        {!isStaging && (
          <button
            className={styles.stageBtn}
            onClick={() => setShowPanel((v) => !v)}
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18" />
              <path d="M3 9h6" />
            </svg>
            Virtual Stage
          </button>
        )}

        {/* Selection panel */}
        {showPanel && (
          <div className={styles.stagePanel}>
            <label>
              Room Type
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value as RoomType)}
              >
                {ROOM_TYPES.map((rt) => (
                  <option key={rt.value} value={rt.value}>
                    {rt.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Style
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value as Style)}
              >
                {STYLES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              className={styles.stageItBtn}
              onClick={handleStageIt}
              type="button"
            >
              Stage It
            </button>
          </div>
        )}

        {/* Loading overlay */}
        {isStaging && (
          <div className={styles.stagingOverlay}>
            <div className={styles.spinner} />
            <span>Staging...</span>
          </div>
        )}

        {/* Original / Staged toggle */}
        {hasStaged && !isStaging && (
          <div className={styles.toggleControl}>
            <button
              className={`${styles.toggleOption} ${!showStaged ? styles.toggleActive : ""}`}
              onClick={() => applyToggle(false)}
              type="button"
            >
              Original
            </button>
            <button
              className={`${styles.toggleOption} ${showStaged ? styles.toggleActive : ""}`}
              onClick={() => applyToggle(true)}
              type="button"
            >
              Staged
            </button>
          </div>
        )}

        {/* Error toast */}
        {stageError && (
          <div className={styles.errorToast} key={stageError}>
            {stageError}
          </div>
        )}
      </div>
    </div>
  );
}
