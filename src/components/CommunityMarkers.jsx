import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Store, Anchor, MapPin } from "lucide-react";

const COMMUNITY_POINTS = [
  // Lojas de Pesca
  { id: 's1', type: 'shop', name: "Loja de Pesca 'O Anzol'", position: [38.7, -9.4], bait: "Casulo, Minhoca Coreana" },
  { id: 's2', type: 'shop', name: "Tackle Shop Lisboa", position: [38.75, -9.1], bait: "Vivos, Amostras" },
  { id: 's3', type: 'shop', name: "Casa do Pescador Matosinhos", position: [41.18, -8.69], bait: "Sardinha, Caranguejo" },
  
  // Rampas de Lançamento
  { id: 'r1', type: 'ramp', name: "Rampa Pública de Cascais", position: [38.69, -9.42], access: "Gratuito" },
  { id: 'r2', type: 'ramp', name: "Rampa Marinha de Belém", position: [38.69, -9.2], access: "Pago" },
  { id: 'r3', type: 'ramp', name: "Rampa Porto de Abrigo Sines", position: [37.95, -8.87], access: "Gratuito" },
];

const shopIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/869/869636.png',
  iconSize: [25, 25],
  iconAnchor: [12, 12]
});

const rampIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3565/3565431.png',
  iconSize: [25, 25],
  iconAnchor: [12, 12]
});

export default function CommunityMarkers({ visible }) {
  if (!visible) return null;

  return (
    <>
      {COMMUNITY_POINTS.map((point) => (
        <Marker 
          key={point.id} 
          position={point.position} 
          icon={point.type === 'shop' ? shopIcon : rampIcon}
        >
          <Popup>
            <div style={{ minWidth: 150 }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: 6 }}>
                {point.type === 'shop' ? <Store size={14} /> : <Anchor size={14} />}
                {point.name}
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>
                {point.type === 'shop' ? (
                  <><strong>Iscos:</strong> {point.bait}</>
                ) : (
                  <><strong>Acesso:</strong> {point.access}</>
                )}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
