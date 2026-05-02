import { useMapEvents } from 'react-leaflet';

export default function MapEventsHandler({ isWaypointMode, onMapClick }) {
  useMapEvents({
    click(e) {
      if (isWaypointMode) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}
