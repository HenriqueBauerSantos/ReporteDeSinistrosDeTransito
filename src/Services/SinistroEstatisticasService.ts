import Api, { getApiResponseData, type CustomResponse } from "./Api";

export type StatisticsGroupBy = "day" | "week" | "month";

export type SinistroEstatisticasFilters = {
    dateStart?: string;
    dateEnd?: string;
    groupBy?: StatisticsGroupBy;
    injuredPeople?: boolean;
    sinistroType?: number;
    roadPavementType?: number;
    roadType?: number;
    groundType?: number;
    weather?: number;
    typeVehicle?: number;
    city?: string;
    district?: string;
};

export type SinistroStatisticCount = {
    value: number;
    count: number;
};

export type SinistroEstatisticas = {
    totalAccidents: number;
    accidentsWithInjuries: number;
    accidentsWithoutInjuries: number;
    injuryRate: number;
    byPeriod: { periodStart: string; count: number }[];
    byAccidentType: SinistroStatisticCount[];
    byWeather: SinistroStatisticCount[];
    byRoadType: SinistroStatisticCount[];
    byRoadPavementType: SinistroStatisticCount[];
    byGroundType: SinistroStatisticCount[];
    byVehicleType: {
        value: number;
        accidentCount: number;
        vehicleCount: number;
    }[];
    byLocation: {
        city: string | null;
        district: string | null;
        count: number;
    }[];
};

export async function buscarEstatisticasSinistros(
    filters: SinistroEstatisticasFilters,
    signal?: AbortSignal,
): Promise<SinistroEstatisticas> {
    const response = await Api.get<CustomResponse<SinistroEstatisticas>>(
        "/sinistros/estatisticas",
        { params: filters, signal }
    );
    const data = getApiResponseData(
        response.data,
        "Não foi possível carregar as estatísticas de sinistros."
    );

    const arrayFields: unknown[] = [
        data?.byPeriod,
        data?.byAccidentType,
        data?.byWeather,
        data?.byRoadType,
        data?.byRoadPavementType,
        data?.byGroundType,
        data?.byVehicleType,
        data?.byLocation,
    ];

    if (
        !data ||
        typeof data !== "object" ||
        arrayFields.some((field) => !Array.isArray(field))
    ) {
        throw new Error("A API retornou estatísticas em formato inválido.");
    }

    return data;
}
