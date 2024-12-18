import { useMap } from "react-leaflet";
import { useCallback, useEffect, useState } from "react";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import L, { LatLngExpression } from "leaflet";
import { useStore } from "../store";
import { fetchCityBoundaries } from "../overpass";
import osm2geojson from "osm2geojson-lite";
import simplify from "simplify-geojson";
import { useTranslation } from "react-i18next";

const OSM_TYPE_MAPPING = {
  N: "node",
  R: "relation",
  W: "way",
};

export const LeafletControlGeocoder = (props: {
  onSearch: (osmType: string, osmId: number) => void;
}) => {
  const { i18n } = useTranslation();
  const [geocoder, setGeocoder] = useState(null);

  const setSelection = useStore((state) => state.setSelection);
  const map = useMap();

  const createControl = useCallback(() => {
    if (geocoder) {
      geocoder.remove();
    }

    const geo = L.Control.geocoder({
      query: "",
      placeholder: i18n.t("controls.search"),
      defaultMarkGeocode: false,
      geocoder: L.Control.Geocoder.photon(),
    });

    setGeocoder(geo);

    geo
      .on("markgeocode", async (e) => {
        map.fitBounds(e.geocode.bbox);
        console.log(e.geocode.bbox);
        map.flyToBounds(e.geocode.bbox.pad(1), {
          animate: true,
          duration: 0.9,
          easeLinearity: 0.3,
        });
        const positions: LatLngExpression[] = [];
        if (e.geocode.properties.osm_type === "R") {
          const boundaries = await fetchCityBoundaries(
            OSM_TYPE_MAPPING[e.geocode.properties.osm_type as any],
            e.geocode.properties.osm_id,
          );
          const geo = { type: "Feature", geometry: osm2geojson(boundaries) };
          const simplified = simplify(geo, 0.001);
          positions.push(
            ...simplified.geometry.coordinates[0].map(([lon, lat]) => [
              lat,
              lon,
            ]),
          );
        } else {
          const { lat, lng } = e.geocode.center;
          const latOffset = 0.001;
          const lngOffset = 0.001;
          positions.push(
            [lat + latOffset, lng - lngOffset],
            [lat + latOffset, lng + lngOffset],
            [lat - latOffset, lng + lngOffset],
            [lat - latOffset, lng - lngOffset],
          );
        }

        setSelection(positions);
      })
      .addTo(map);
  }, [geocoder, setGeocoder, setSelection, map]);

  useEffect(() => {
    createControl();
  }, [i18n.language]);

  return null;
};
