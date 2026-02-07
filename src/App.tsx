import { useRef } from "react";
import { photos } from "./data/photos";
import { useLightbox } from "./hooks/useLightbox";
import { Header } from "./components/Header/Header";
import { PhotoGrid } from "./components/PhotoGrid/PhotoGrid";
import { MapCard } from "./components/MapCard/MapCard";
import { Lightbox } from "./components/Lightbox/Lightbox";
import { Footer } from "./components/Footer/Footer";
import styles from "./App.module.css";

const PROPERTY_ADDRESS = "2689 Irving St, Denver, CO 80211";
const TOUR_URL =
  "https://www.zillow.com/view-imx/359fd819-4b77-4998-873e-17792e16a6e0?setAttribution=mls&wl=true&initialViewType=pano&utm_source=dashboard";

function App() {
  const photoRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const lightbox = useLightbox(photos.length, photoRefs);

  return (
    <div className={styles.app}>
      <Header />
      <PhotoGrid
        photos={photos}
        onPhotoClick={lightbox.open}
        photoRefs={photoRefs}
      />
      <div className={styles.mapTourRow}>
        <div id="map" className={styles.mapTourCard}>
          <MapCard address={PROPERTY_ADDRESS} />
        </div>
        <div className={styles.mapTourCard}>
          <div id="tour" className={styles.tourEmbed}>
            <iframe
              className={styles.tourIframe}
              src={TOUR_URL}
              title="3D Tour"
              allowFullScreen
            />
          </div>
        </div>
      </div>
      <Footer />
      <Lightbox
        photos={photos}
        currentIndex={lightbox.currentIndex}
        isOpen={lightbox.isOpen}
        onClose={lightbox.close}
        onPrev={lightbox.prev}
        onNext={lightbox.next}
      />
    </div>
  );
}

export default App;
