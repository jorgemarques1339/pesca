import React from "react";
import { Marker, Tooltip, Popup } from "react-leaflet";
import TideWidget from "./TideWidget";
import TideChartPopup from "./TideChartPopup";

export default function TideMarkers({ tides }) {
  if (tides.loading || tides.error) return null;

  const tideRegions = [
    { id: 'norte', pos: [41.2, -9.6], title: "Norte" },
    { id: 'centro', pos: [39.1, -10.3], title: "Centro" },
    { id: 'sul', pos: [36.7, -8.8], title: "Sul" }
  ];

  return (
    <>
      {tideRegions.map(region => (
        <Marker key={region.id} position={region.pos} opacity={0}>
          <Tooltip permanent direction="center" className="tide-tooltip-container">
            <TideWidget title={region.title} data={tides[region.id]} />
          </Tooltip>
          <Popup className="ios-popup">
            <TideChartPopup tides={tides[region.id]} />
          </Popup>
        </Marker>
      ))}
    </>
  );
}
