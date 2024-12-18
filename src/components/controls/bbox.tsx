import Control from "react-leaflet-custom-control";
import React from "react";
import { useStore } from "../../store";
import { useShallow } from "zustand/react/shallow";
import { LatLng } from "leaflet";
import { useMap } from "react-leaflet";
import { SetLocationIcon } from "../../icons/set-location";

export const moveSelectionAroundPoint = (props: {
  lat: number;
  lng: number;
  map: ReturnType<typeof useMap>;
  setSelection: (selection: [number, number][]) => void;
}): void => {
  const bbox = new LatLng(props.lat, props.lng).toBounds(1000);
  const ne = bbox.getNorthEast();
  const sw = bbox.getSouthWest();
  props.setSelection([
    [ne.lat, ne.lng],
    [sw.lat, ne.lng],
    [sw.lat, sw.lng],
    [ne.lat, sw.lng],
  ]);
  props.map.flyToBounds(bbox.pad(1), {
    animate: true,
    duration: 0.9,
    easeLinearity: 0.3,
  });
};

export const BboxControl = () => {
  const map = useMap();
  const [selection, setSelection] = useStore(
    useShallow((store) => [store.selection, store.setSelection]),
  );

  return (
    <Control position="topleft">
      <div className="language-picker">
        <button
          className="language-button button"
          onClick={() =>
            moveSelectionAroundPoint({
              lng: map.getCenter().lng,
              lat: map.getCenter().lat,
              map,
              setSelection,
            })
          }
        >
          <SetLocationIcon />
        </button>
      </div>
    </Control>
  );
};
