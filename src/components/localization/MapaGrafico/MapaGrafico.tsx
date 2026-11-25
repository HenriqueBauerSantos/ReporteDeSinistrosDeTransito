import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, Polygon, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet";
import type { LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import { DEFAULT_MAP_CENTER } from "../../../config/mapConfig";
import {
    type MapaBounds,
    type SinistroMapaFilters,
} from "../../../Services/SinistroMapaService";
import { useMapaSinistros } from "../../../hooks/useMapaSinistros";
import { FiltrosMapa } from "../MapaSinistros/FiltrosMapa";
import { groupSinistrosIntoHexagons } from "./hexagonalGrid";
import "./MapaGrafico.css";
import "../MapaSinistros/Style.css";

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

function ViewportTracker({
    onBoundsChange,
    onZoomChange,
}: {
    onBoundsChange: (bounds: MapaBounds) => void;
    onZoomChange: (zoom: number) => void;
}) {
    const map = useMap();

    useMapEvents({
        moveend: () => onBoundsChange(toMapaBounds(map.getBounds())),
        zoomend: () => onZoomChange(map.getZoom()),
    });

    useEffect(() => {
        onBoundsChange(toMapaBounds(map.getBounds()));
        onZoomChange(map.getZoom());
    }, [map, onBoundsChange, onZoomChange]);

    return null;
}

function getCellColor(count: number, maxCount: number) {
    const relativeCount = count / maxCount;
    if (relativeCount >= 0.8) return "#a50026";
    if (relativeCount >= 0.6) return "#d73027";
    if (relativeCount >= 0.4) return "#f46d43";
    if (relativeCount >= 0.2) return "#fdae61";
    return "#fee08b";
}

export function MapaGrafico() {
    const [filters, setFilters] = useState<SinistroMapaFilters>({});
    const [zoom, setZoom] = useState(13);
    const { sinistros, loading, hasLoaded, error, setBounds } = useMapaSinistros(filters);
    const handleBoundsChange = useCallback((bounds: MapaBounds) => setBounds(bounds), [setBounds]);
    const handleZoomChange = useCallback((currentZoom: number) => setZoom(currentZoom), []);
    const cells = useMemo(
        () => groupSinistrosIntoHexagons(sinistros, zoom),
        [sinistros, zoom],
    );
    const maxCellCount = cells.reduce((max, cell) => Math.max(max, cell.count), 1);

    return (
        <main className="sinistros-map-page">
            <h1 className="page-title">Mapa Gráfico</h1>
            <p className="sinistros-map-description">
                As células mostram a concentração de sinistros na área visível. A agregação se ajusta ao zoom.
            </p>
            <FiltrosMapa onApply={setFilters} />
            <div className="hex-map-legend" aria-label="Legenda de concentração">
                <span>Menor concentração</span>
                <div className="hex-map-legend-scale" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                </div>
                <span>Maior concentração</span>
            </div>
            <section className="sinistros-map-section" aria-label="Mapa gráfico de sinistros">
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
                    <ViewportTracker
                        onBoundsChange={handleBoundsChange}
                        onZoomChange={handleZoomChange}
                    />
                    {cells.map((cell) => (
                        <Polygon
                            key={cell.key}
                            positions={cell.positions}
                            pathOptions={{
                                color: "#fff",
                                weight: 1,
                                fillColor: getCellColor(cell.count, maxCellCount),
                                fillOpacity: 0.78,
                            }}
                        >
                            <Tooltip sticky className="hex-map-cell-tooltip">
                                {cell.count} {cell.count === 1 ? "sinistro" : "sinistros"} nesta área
                            </Tooltip>
                        </Polygon>
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
                    <p>
                        {sinistros.length} sinistro(s) agrupado(s) em {cells.length} célula(s) nesta área.
                    </p>
                )}
            </div>
        </main>
    );
}
