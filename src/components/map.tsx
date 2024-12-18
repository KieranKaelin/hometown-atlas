import "leaflet-editable";
import { MapContainer, Pane, TileLayer } from "react-leaflet";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { fetchCityBoundaries } from "../overpass";
import { LeafletControlGeocoder } from "./geocoder";
import simplify from "simplify-geojson";
import osm2geojson from "osm2geojson-lite";
import { useStore } from "../store";
import { Selection } from "./selection";
import { Form } from "./form";
import { Roads } from "./roads";
import { useShallow } from "zustand/react/shallow";
import Control from "react-leaflet-custom-control";
import { LanguagePicker } from "./controls/language-picker";
import { LayersIcon } from "../icons/layers";
import "./map.css";
import { ZoomControl } from "./controls/zoom";
import { getMapBounds, getMapLayer, setMapLayer } from "../constants";
import { MapListeners } from "./map-listeners";
import { Tutorial } from "./tutorial";
import { BboxControl } from "./controls/bbox";
import { LocateControl } from "./controls/locate";

export const Map = () => {
  const [isPlaying, selection, setSelection] = useStore(
    useShallow((state) => [
      state.isPlaying,
      state.selection,
      state.setSelection,
    ]),
  );

  const [isSatellite, setSatellite] = useState(getMapLayer() === "esri");

  const selectionRef = useRef(null);
  useEffect(() => selectionRef.current?.enableEdit(), [selectionRef]);

  const onSearch = useCallback(
    async (osmType: string, osmId: number) => {
      const boundaries = await fetchCityBoundaries(osmType, osmId);
      const geo = { type: "Feature", geometry: osm2geojson(boundaries) };
      const positions = [];

      if (geo.geometry.type === "FeatureCollection") {
        const [lat, lon] = geo.geometry.features[0].geometry.coordinates;
        const lonOffset = 0.007;
        const latOffset = 0.01;
        const bbox = [
          [lon - lonOffset, lat + latOffset],
          [lon + lonOffset, lat + latOffset],
          [lon + lonOffset, lat - latOffset],
          [lon - lonOffset, lat - latOffset],
        ];
        positions.push(...bbox);
      } else {
        const simplified = simplify(geo, 0.001);
        positions.push(
          ...simplified.geometry.coordinates[0].map(([lon, lat]) => [lat, lon]),
        );
      }
      setSelection(positions);
    },
    [selectionRef],
  );

  return (
    <div data-theme="dark">
      <Form />
      <Tutorial />

      <MapContainer
        style={{
          height: "100%",
          width: "100%",
          left: 0,
          top: 0,
          position: "absolute",
        }}
        bounds={getMapBounds()}
        scrollWheelZoom
        editable
        fadeAnimation
        attributionControl={false}
        zoomSnap={0}
        zoomControl={false}
      >
        <MapListeners />

        {isSatellite ? (
          <TileLayer
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={20}
            edgeBufferTiles={5}
          />
        ) : null}
        {!isSatellite ? (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
            maxZoom={20}
            edgeBufferTiles={5}
            opacity={isPlaying ? 1 : 0}
          />
        ) : null}
        {!isSatellite ? (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            maxZoom={20}
            edgeBufferTiles={5}
            opacity={isPlaying ? 0 : 1}
          />
        ) : null}

        <LeafletControlGeocoder onSearch={onSearch} />

        <ZoomControl />
        <Control position="topleft">
          <LocateControl />
        </Control>
        <BboxControl />
        <Control position="topleft">
          <div className="language-picker">
            <button
              className="language-button button"
              onClick={() => {
                setSatellite((prev) => {
                  setMapLayer(prev ? "carto" : "esri");
                  return !prev;
                });
              }}
            >
              <LayersIcon />
            </button>
          </div>
        </Control>
        <Control position="topleft">
          <LanguagePicker />
        </Control>

        <Selection />

        <Pane name="roads" style={{ opacity: 0.8 }}>
          <Roads type="current" />
          <Roads type="correct" />
          <Roads type="wrong" />
        </Pane>
      </MapContainer>
    </div>
  );
};
