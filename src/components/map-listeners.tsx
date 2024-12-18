import { useMap } from "react-leaflet";
import { setMapBounds } from "../constants";

export const MapListeners = () => {
  const map = useMap();

  map.on("moveend", () => {
    const bounds = map.getBounds();
    const nw = bounds.getNorthWest();
    const se = bounds.getSouthEast();
    setMapBounds([
      [nw.lat, nw.lng],
      [se.lat, se.lng],
    ]);
  });
};
