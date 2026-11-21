import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { SinistroTypeLabel } from "../../../enums/SinistroType";
import { TypeVehicleLabel } from "../../../enums/TypeVehicle";
import type { SinistroMapa } from "../../../Services/SinistroMapaService";

const markerIcon = L.icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

function getLabel(labels: Record<number, string>, value: number) {
    return labels[value] ?? "Não informado";
}

function formatAddress(sinistro: SinistroMapa) {
    return [
        sinistro.road,
        sinistro.district,
        [sinistro.city, sinistro.state].filter(Boolean).join(" - "),
    ]
        .filter(Boolean)
        .join(", ") || "Endereço não informado";
}

export function SinistroMapaMarker({ sinistro }: { sinistro: SinistroMapa }) {
    const date = new Date(sinistro.date);
    const formattedDate = Number.isNaN(date.getTime())
        ? sinistro.date
        : date.toLocaleString("pt-BR");

    return (
        <Marker position={[sinistro.latitude, sinistro.longitude]} icon={markerIcon}>
            <Popup>
                <div className="sinistro-map-popup">
                    <strong>{getLabel(SinistroTypeLabel, sinistro.sinistroType)}</strong>
                    <div>Data: {formattedDate}</div>
                    <div>Ocorrência: {getLabel(SinistroTypeLabel, sinistro.sinistroType)}</div>
                    <div>Houve vítimas: {sinistro.injuredPeople ? "Sim" : "Não"}</div>
                    <div>Endereço: {formatAddress(sinistro)}</div>
                    {sinistro.vehicleTypes.length > 0 && (
                        <div>
                            Veículos:{" "}
                            {sinistro.vehicleTypes
                                .map((type) => getLabel(TypeVehicleLabel, type))
                                .join(", ")}
                        </div>
                    )}
                </div>
            </Popup>
        </Marker>
    );
}
