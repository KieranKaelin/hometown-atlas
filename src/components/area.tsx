import { Polygon } from "react-leaflet";
import { useEffect, useRef } from "react";

export function Area() {
  const polygonRef = useRef<null>(null);

  useEffect(() => {
    polygonRef.current?.enableEdit();
  }, [polygonRef]);

  return (
    <Polygon
      ref={polygonRef}
      eventHandlers={{
        "editable:edited": (event) =>
          console.log(
            "Polygon coordinates",
            event.layer.toGeoJSON().geometry.coordinates.toString(),
          ),
      }}
      editable
      fill={false}
      interactive
      positions={[
        [51.5, -0.1],
        [51.5, 0],
        [51.55, -0.1],
      ]}
    ></Polygon>
  );
}
