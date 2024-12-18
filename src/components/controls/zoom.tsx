import { PlusIcon } from "../../icons/plus";
import { MinusIcon } from "../../icons/minus";
import Control from "react-leaflet-custom-control";
import React from "react";
import { useMap } from "react-leaflet";

export const ZoomControl = () => {
  const map = useMap();

  return (
    <Control position="topleft">
      <div
        className="language-picker"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <button
          className="language-button button"
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
          onClick={() => map.setZoom(map.getZoom() + 1)}
        >
          <PlusIcon />
        </button>
        <button
          className="language-button button"
          style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
          onClick={() => map.setZoom(map.getZoom() - 1)}
        >
          <MinusIcon />
        </button>
      </div>
    </Control>
  );
};
