import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import TideWidget from "./TideWidget";

export default function TideMarkers({ tides }) {
  if (tides.loading || tides.error) return null;

  return (
    <>
      {/* Norte (Offshore Viana/Porto) */}
      <Marker position={[41.2, -9.6]} opacity={0}>
        <Tooltip permanent direction="center" className="tide-tooltip-container">
          <TideWidget title="Norte" data={tides.norte} />
        </Tooltip>
      </Marker>
      
      {/* Centro (Offshore Peniche/Lisboa) */}
      <Marker position={[39.1, -10.3]} opacity={0}>
        <Tooltip permanent direction="center" className="tide-tooltip-container">
          <TideWidget title="Centro" data={tides.centro} />
        </Tooltip>
      </Marker>
      
      {/* Sul (Offshore Sagres/Faro) */}
      <Marker position={[36.7, -8.8]} opacity={0}>
        <Tooltip permanent direction="center" className="tide-tooltip-container">
          <TideWidget title="Sul" data={tides.sul} />
        </Tooltip>
      </Marker>
    </>
  );
}
