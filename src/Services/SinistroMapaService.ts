import Api from "./Api";

export type SinistroMapa = {
    id: string;
    date: string;
    injuredPeople: boolean;
    sinistroType: number;
    latitude: number;
    longitude: number;
    road: string | null;
    district: string | null;
    city: string | null;
    state: string | null;
    vehicleTypes: number[];
};

export type SinistroMapaFilters = {
    dateStart?: string;
    dateEnd?: string;
    injuredPeople?: boolean;
    sinistroType?: number;
    roadPavementType?: number;
    roadType?: number;
    groundType?: number;
    weather?: number;
    typeVehicle?: number;
};

export type MapaBounds = {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
};

export async function buscarSinistrosNoMapa(
    bounds: MapaBounds,
    filters: SinistroMapaFilters,
    signal?: AbortSignal,
): Promise<SinistroMapa[]> {
    const response = await Api.get<SinistroMapa[]>("/sinistros/mapa", {
        params: { ...filters, ...bounds },
        signal,
    });

    return response.data;
}
