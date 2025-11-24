import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Style.css";

type MapPickerProps = {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number | null;
  initialLng?: number | null;
  initialZoom?: number;
};

// Corrige o ícone padrão do Leaflet
const markerIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

function LocationMarker({
  onLocationSelect,
  initialLat,
  initialLng,
}: MapPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialLat != null && initialLng != null ? [initialLat, initialLng] : null
  );

  const map = useMap();
  const hasCenteredRef = useRef(false);

  // Centraliza apenas uma vez, na primeira renderização
  useEffect(() => {
    if (
      !hasCenteredRef.current &&
      initialLat != null &&
      initialLng != null
    ) {
      const newPos: [number, number] = [initialLat, initialLng];
      setPosition(newPos);
      map.setView(newPos);
      hasCenteredRef.current = true;
    }
  }, [initialLat, initialLng, map]);

  // Permite selecionar nova posição com clique
  useMapEvents({
    click(e: LeafletMouseEvent) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

export function MapPicker({
  onLocationSelect,
  initialLat,
  initialLng,
  initialZoom = 13,
}: MapPickerProps) {
  const defaultPosition: [number, number] = [-29.3242, -49.7579];
  const centerPosition: [number, number] =
    initialLat && initialLng ? [initialLat, initialLng] : defaultPosition;

  return (
    <div className="map-wrapper">
      <MapContainer
        center={centerPosition}
        zoom={initialZoom}
        scrollWheelZoom={true}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          onLocationSelect={onLocationSelect}
          initialLat={initialLat}
          initialLng={initialLng}
        />
      </MapContainer>
    </div>
  );
}
