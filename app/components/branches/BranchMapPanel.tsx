import { MapPin, ExternalLink, Navigation } from 'lucide-react';
import styles from './BranchMapPanel.module.css';

interface Props {
  branchId: string;
  branchName: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  prominentDirections?: boolean;
}

export default function BranchMapPanel({
  branchId,
  branchName,
  address,
  latitude,
  longitude,
  prominentDirections = false,
}: Props) {
  const hasCoords = latitude !== null && longitude !== null;

  const mapSrc = hasCoords
    ? `https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed&hl=vi`
    : address
      ? `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed&hl=vi`
      : null;

  const directionsHref = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
    : address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      : null;

  return (
    <div className={styles.panel}>
      <div className={styles.infoBar}>
        <MapPin size={16} className={styles.infoIcon} />
        <div className={styles.infoContent}>
          <p className={styles.infoName}>{branchName}</p>
          {address && <p className={styles.infoAddress}>{address}</p>}
        </div>
      </div>

      {mapSrc ? (
        <>
          <div className={styles.mapFrame}>
            <iframe
              key={branchId}
              src={mapSrc}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Bản đồ ${branchName}`}
            />
          </div>

          {directionsHref && (
            <div className={styles.directionsBar}>
              {prominentDirections ? (
                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.directionsBtn}
                  aria-label={`Chỉ đường đến ${branchName}`}
                >
                  <Navigation size={15} />
                  Chỉ đường đến cơ sở này
                </a>
              ) : (
                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.directionsLink}
                  aria-label={`Mở bản đồ ${branchName} trong Google Maps`}
                >
                  <ExternalLink size={13} />
                  Mở trong Google Maps
                </a>
              )}
            </div>
          )}
        </>
      ) : (
        <div className={styles.noMap}>
          <MapPin size={40} className={styles.noMapIcon} />
          <p className={styles.noMapText}>Chưa có bản đồ</p>
        </div>
      )}
    </div>
  );
}
