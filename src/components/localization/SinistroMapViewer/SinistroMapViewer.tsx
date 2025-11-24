import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Style.css";

type MapViewerProps = {
    latitude: number;
    longitude: number;
    zoom?: number;
    label?: string;
};

// Ícone padrão do marcador
const markerIcon = L.icon({
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Componente interno para atualizar o centro **somente quando o ponto muda**
function MapUpdater({
    latitude,
    longitude,
}: {
    latitude: number;
    longitude: number;
}) {
    const map = useMap();
    const lastPosition = useRef<[number, number]>([latitude, longitude]);

    useEffect(() => {
        const [lastLat, lastLng] = lastPosition.current;
        // Atualiza apenas se a posição realmente mudou
        if (latitude !== lastLat || longitude !== lastLng) {
            const newPos: [number, number] = [latitude, longitude];
            map.setView(newPos);
            lastPosition.current = newPos;
        }
    }, [latitude, longitude, map]);

    return null;
}

export function SinistroMapViewer({
    latitude,
    longitude,
    zoom = 15,
    label = "Local do sinistro",
}: MapViewerProps) {
    return (
        <div className="map-wrapper">
            <MapContainer
                center={[latitude, longitude]}
                zoom={zoom}
                scrollWheelZoom={true}
                className="map-container"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Mantém o marcador fixo */}
                <Marker position={[latitude, longitude]} icon={markerIcon}>
                    <Popup>{label}</Popup>
                </Marker>

                {/* Atualiza a posição do mapa somente quando o sinistro muda */}
                <MapUpdater latitude={latitude} longitude={longitude} />
            </MapContainer>
        </div>
    );
}
