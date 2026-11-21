import Api, { getApiResponseList, type CustomResponse } from "./Api";

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
    minLatitude: number;
    maxLatitude: number;
    minLongitude: number;
    maxLongitude: number;
};

export async function buscarSinistrosNoMapa(
    bounds: MapaBounds,
    filters: SinistroMapaFilters,
    signal?: AbortSignal,
): Promise<SinistroMapa[]> {
    const response = await Api.get<CustomResponse<SinistroMapa[]>>("/sinistros/mapa", {
        params: { ...filters, ...bounds },
        signal,
    });

    return getApiResponseList(response.data, "Não foi possível carregar marcadores do mapa.");
}
