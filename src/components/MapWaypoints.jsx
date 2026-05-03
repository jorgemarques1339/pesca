import React from "react";
import { Marker, Popup } from "react-leaflet";
import { MapPin, Navigation } from "lucide-react";

export default function MapWaypoints({ waypoints, onRemoveWaypoint, onNavigateTo }) {
  return (
    <>
      {waypoints.map((wp) => (
        <Marker key={wp.id} position={[wp.lat, wp.lng]}>
          <Popup>
            <div style={{ padding: "4px", textAlign: "center" }}>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "var(--accent-cyan)" }}>
                <MapPin size={16} style={{ verticalAlign: 'middle', marginRight: 4 }}/>
                {wp.name}
              </h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={() => onNavigateTo(wp)}
                  style={{ flex: 1, background: 'var(--accent-blue)', border: 'none', color: '#fff', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                >
                  <Navigation size={14} /> Navegar
                </button>
                <button 
                  onClick={() => onRemoveWaypoint(wp.id)}
                  style={{ background: 'none', border: '1px solid var(--status-bad)', color: 'var(--status-bad)', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}
                >
                  Remover
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
