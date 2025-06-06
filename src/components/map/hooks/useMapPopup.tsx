
import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { createRoot } from "react-dom/client";
import MapPopup from "../MapPopup";
import { MutableRefObject } from "react";
import { PointData } from "../utils/mapData";

interface ActivePopup {
  id: string;
  lngLat: mapboxgl.LngLat;
}

interface MapPopupProps {
  map: MutableRefObject<mapboxgl.Map | null>;
  activePopup: ActivePopup | null;
  mapData: PointData[];
  setActivePopup: React.Dispatch<React.SetStateAction<ActivePopup | null>>;
}

export const useMapPopup = ({ map, activePopup, mapData, setActivePopup }: MapPopupProps) => {
  // Render popup when a marker is clicked
  useEffect(() => {
    if (!map.current || !activePopup) return;

    const point = mapData.find((p) => p.id === activePopup.id);
    if (!point) return;

    const popupNode = document.createElement("div");
    const root = createRoot(popupNode);
    
    root.render(
      <MapPopup 
        point={point} 
        onClose={() => setActivePopup(null)} 
      />
    );

    const popup = new mapboxgl.Popup({
      closeOnClick: false
    })
      .setLngLat(activePopup.lngLat)
      .setDOMContent(popupNode)
      .addTo(map.current);

    popup.on("close", () => setActivePopup(null));

    return () => {
      popup.remove();
      root.unmount();
    };
  }, [activePopup, mapData, map, setActivePopup]);
};
