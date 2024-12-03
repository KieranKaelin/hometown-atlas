import "leaflet-editable";
import { MapContainer, TileLayer } from "react-leaflet";
import { Area } from "./area";

export const Map = () => {
  return (
    <MapContainer
      style={{
        height: "100vh",
        width: "100vw",
        left: 0,
        top: 0,
        position: "absolute",
      }}
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom
      editable
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Area />
    </MapContainer>
  );
};
