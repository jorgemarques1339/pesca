import React from "react";
import { Polygon, Polyline, Popup } from "react-leaflet";
import { ZONES } from "../constants/zones";

export default function ZonePolygons({ isWaypointMode, onZoneClick }) {
  return (
    <>
      {ZONES.map((zone) => (
        <React.Fragment key={zone.id}>
          {zone.type === "forbidden" ? (
            <Polygon
              positions={zone.coordinates}
              pathOptions={{
                color: "var(--status-bad)",
                fillColor: "var(--status-bad)",
                fillOpacity: 0.3,
                weight: 2,
                dashArray: "10, 10"
              }}
              eventHandlers={{
                click: () => {
                  if (!isWaypointMode) onZoneClick(zone);
                },
              }}
            >
              <Popup>
                <div style={{ padding: "4px" }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "var(--status-bad)" }}>
                    {zone.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: "14px" }}>{zone.description}</p>
                  <div style={{ marginTop: 8, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.8 }}>
                    Status: PROIBIDO / RESTRITO
                  </div>
                </div>
              </Popup>
            </Polygon>
          ) : (
            <Polyline
              positions={zone.coordinates}
              pathOptions={{
                color: "var(--status-good)",
                weight: 5,
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
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "var(--status-good)" }}>
                    {zone.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: "14px" }}>{zone.description}</p>
                  <div style={{ marginTop: 8, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.8 }}>
                    Status: PERMITIDO
                  </div>
                </div>
              </Popup>
            </Polyline>
          )}
        </React.Fragment>
      ))}
    </>
  );
}
