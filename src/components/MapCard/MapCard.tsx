import styles from "./MapCard.module.css";

interface MapCardProps {
  address: string;
}

export function MapCard({ address }: MapCardProps) {
  const query = encodeURIComponent(address);

  return (
    <div className={styles.card}>
      <iframe
        className={styles.map}
        title="Property location"
        src={`https://www.google.com/maps?q=${query}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
