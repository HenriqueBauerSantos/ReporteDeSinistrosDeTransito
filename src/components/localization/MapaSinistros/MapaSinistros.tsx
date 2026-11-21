import { useCallback, useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import { DEFAULT_MAP_CENTER } from "../../../config/mapConfig";
import {
    type MapaBounds,
    type SinistroMapaFilters,
} from "../../../Services/SinistroMapaService";
import { useMapaSinistros } from "../../../hooks/useMapaSinistros";
import { FiltrosMapa } from "./FiltrosMapa";
import { SinistroMapaMarker } from "./SinistroMapaMarker";
import "./Style.css";

function toMapaBounds(bounds: LatLngBounds): MapaBounds {
    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();

    return {
        minLatitude: southWest.lat,
        maxLatitude: northEast.lat,
        minLongitude: southWest.lng,
        maxLongitude: northEast.lng,
    };
}

function ViewportTracker({ onBoundsChange }: { onBoundsChange: (bounds: MapaBounds) => void }) {
    const map = useMap();
    useMapEvents({
        moveend: () => onBoundsChange(toMapaBounds(map.getBounds())),
    });

    useEffect(() => {
        onBoundsChange(toMapaBounds(map.getBounds()));
    }, [map, onBoundsChange]);

    return null;
}

export function MapaSinistros() {
    const [filters, setFilters] = useState<SinistroMapaFilters>({});
    const { sinistros, loading, hasLoaded, error, setBounds } = useMapaSinistros(filters);
    const handleBoundsChange = useCallback((bounds: MapaBounds) => setBounds(bounds), [setBounds]);

    return (
        <main className="sinistros-map-page">
            <h1>Mapa de sinistros</h1>
            <FiltrosMapa onApply={setFilters} />
            <section className="sinistros-map-section" aria-label="Mapa de sinistros">
                <MapContainer
                    center={DEFAULT_MAP_CENTER}
                    zoom={13}
                    scrollWheelZoom
                    className="sinistros-map"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ViewportTracker onBoundsChange={handleBoundsChange} />
                    {sinistros.map((sinistro) => (
                        <SinistroMapaMarker key={sinistro.id} sinistro={sinistro} />
                    ))}
                </MapContainer>
            </section>
            <div className="sinistros-map-status" role="status" aria-live="polite">
                {loading && <p>Carregando sinistros desta área...</p>}
                {error && <p className="sinistros-map-error">{error}</p>}
                {!loading && hasLoaded && !error && sinistros.length === 0 && (
                    <p>Nenhum sinistro localizado nesta área com os filtros selecionados.</p>
                )}
                {!loading && hasLoaded && !error && sinistros.length > 0 && (
                    <p>{sinistros.length} sinistro(s) exibido(s) nesta área.</p>
                )}
            </div>
        </main>
    );
}
