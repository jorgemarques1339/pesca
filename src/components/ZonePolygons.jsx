import React from "react";
import { Polygon, Polyline, Popup } from "react-leaflet";
import { ZONES } from "../constants/zones";

export default function ZonePolygons({ isWaypointMode, onZoneClick }) {
  return (
    <>
      {ZONES.map((zone) => (
        <React.Fragment key={zone.id}>
          {/* Main Demarcation Line following the coast */}
          <Polyline
            positions={zone.coordinates}
            pathOptions={{
              color: zone.type === "allowed" ? "var(--status-good)" : "var(--status-bad)",
              weight: zone.type === "allowed" ? 5 : 7,
              dashArray: zone.type === "forbidden" ? "15, 12" : "none",
              lineCap: 'round',
              lineJoin: 'round',
            }}
            eventHandlers={{
              click: () => {
                if (!isWaypointMode) onZoneClick(zone);
              },
            }}
          >
            <Popup>
              <div style={{ padding: "4px" }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: zone.type === "allowed" ? "var(--status-good)" : "var(--status-bad)" }}>
                  {zone.name}
                </h3>
                <p style={{ margin: 0, fontSize: "14px" }}>{zone.description}</p>
                <div style={{ marginTop: 8, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.8 }}>
                  Status: {zone.type === "allowed" ? "PERMITIDO" : "PROIBIDO / RESTRITO"}
                </div>
              </div>
            </Popup>
          </Polyline>
        </React.Fragment>
      ))}
    </>
  );
}
