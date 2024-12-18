import { Polygon } from "react-leaflet";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useStore } from "../store.ts";
import { Layer, LayersControlEventHandlerFn } from "leaflet";
import { useShallow } from "zustand/react/shallow";

export const Selection = () => {
  const [selection, setSelection, isPlaying] = useStore(
    useShallow((state) => [
      state.selection,
      state.setSelection,
      state.isPlaying,
    ]),
  );

  const ref = useRef(null);

  useEffect(() => {
    ref.current?.disableEdit();
    ref.current?.setLatLngs(selection);
    ref.current?.enableEdit();
    ref.current?.redraw();
  }, [selection]);

  const onSelectionUpdate = useCallback(
    (layer: Layer) =>
      setSelection(
        layer
          .toGeoJSON()
          .geometry.coordinates[0].map((point) => [point[1], point[0]]),
      ),
    [setSelection],
  );

  const eventHandlers = useMemo(
    (): Record<string, LayersControlEventHandlerFn> => ({
      "editable:edited": (e) => onSelectionUpdate(e.layer),
      "editable:vertex:deleted": (e) => onSelectionUpdate(e.layer),
    }),
    [onSelectionUpdate],
  );

  return isPlaying ? null : (
    <Polygon
      ref={ref}
      eventHandlers={eventHandlers}
      editable
      fill={false}
      positions={selection}
    />
  );
};
