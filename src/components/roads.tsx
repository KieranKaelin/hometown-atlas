import {
  FeatureGroup,
  LayerGroup,
  Polyline,
  Tooltip,
  useMap,
} from "react-leaflet";
import { useEffect, useMemo, useRef } from "react";
import { useStore } from "../store";
import { useShallow } from "zustand/react/shallow";

const COLORS = {
  correct: "#0F0",
  wrong: "#F00",
  current: "#00F",
};

export const Roads = (props: { type: keyof typeof COLORS }) => {
  let [roads] = useStore(useShallow((state) => [state.roads]));
  roads = useMemo(
    () => roads.filter((road) => road.state === props.type),
    [roads],
  );

  const isCurrent = props.type === "current";

  const ref = useRef();
  const map = useMap();

  useEffect(() => {
    const feature = ref.current;
    if (isCurrent && feature) {
      if (!map.getCenter().equals(feature.getBounds().getCenter(), 0.001)) {
        map.flyToBounds(feature.getBounds().pad(1), {
          animate: true,
          duration: 0.9,
          easeLinearity: 0.3,
        });
      }
    }
  }, [isCurrent, roads]);

  return (
    <LayerGroup>
      {roads.map((road) => (
        <FeatureGroup key={road.name} ref={ref}>
          {road.positions.map((position, i) => (
            <Polyline
              key={`${road.name}-${i}`}
              weight={5}
              smoothFactor={1}
              color={COLORS[props.type]}
              positions={position}
            ></Polyline>
          ))}
          {!isCurrent ? <Tooltip>{road.name}</Tooltip> : null}
        </FeatureGroup>
      ))}
    </LayerGroup>
  );
};
