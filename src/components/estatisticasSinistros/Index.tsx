import { useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { getApiErrorMessage } from "../../Services/Api";
import {
    buscarEstatisticasSinistros,
    type SinistroEstatisticas,
    type SinistroEstatisticasFilters,
    type SinistroStatisticCount,
} from "../../Services/SinistroEstatisticasService";
import { GroundTypeLabel } from "../../enums/GroundType";
import { RoadPavementTypeLabel } from "../../enums/RoadPavementType";
import { RoadTypeLabel } from "../../enums/RoadType";
import { SinistroTypeLabel } from "../../enums/SinistroType";
import { TypeVehicleLabel } from "../../enums/TypeVehicle";
import { WeatherLabel } from "../../enums/Weather";
import { FiltrosEstatisticas } from "./FiltrosEstatisticas";
import "./Index.css";

const initialFilters: SinistroEstatisticasFilters = { groupBy: "month" };
const chartColors = ["#148a4b", "#e79b24", "#3975b7", "#b54b4b"];

type CountChartPoint = {
    name: string;
    count: number;
};

function getEnumLabel(labels: object, value: number): string {
    const option = Object.entries(labels).find(([key]) => Number(key) === value);
    return typeof option?.[1] === "string" ? option[1] : `Valor ${value}`;
}

function toEnumChartData(items: SinistroStatisticCount[], labels: object): CountChartPoint[] {
    return items.map((item) => ({
        name: getEnumLabel(labels, item.value),
        count: item.count,
    }));
}

function formatPeriod(value: string, groupBy: SinistroEstatisticasFilters["groupBy"]): string {
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;

    if (groupBy === "month") {
        return date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
    }

    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function ChartPanel({
    title,
    children,
    hasData,
    wide = false,
    chartHeight,
}: {
    title: string;
    children: ReactNode;
    hasData: boolean;
    wide?: boolean;
    chartHeight?: number;
}) {
    return (
        <section className={`statistics-chart-panel${wide ? " statistics-chart-panel-wide" : ""}`}>
            <h2>{title}</h2>
            {hasData ? (
                <div
                    className="statistics-chart"
                    style={chartHeight ? { height: chartHeight } : undefined}
                >
                    {children}
                </div>
            ) : (
                <p className="statistics-chart-empty">Sem dados para exibir.</p>
            )}
        </section>
    );
}

function CountBarChart({ data }: { data: CountChartPoint[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 8, right: 18, bottom: 8, left: 8 }}
            >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={125} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" name="Sinistros" fill="#148a4b" radius={[0, 4, 4, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function EstatisticasSinistros() {
    const [filters, setFilters] = useState<SinistroEstatisticasFilters>(initialFilters);
    const [statistics, setStatistics] = useState<SinistroEstatisticas | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        let isCurrentRequest = true;

        setLoading(true);
        setError(null);
        setStatistics(null);

        buscarEstatisticasSinistros(filters, controller.signal)
            .then((data) => {
                if (isCurrentRequest) setStatistics(data);
            })
            .catch((requestError: unknown) => {
                if (isCurrentRequest && !axios.isCancel(requestError)) {
                    setError(
                        getApiErrorMessage(
                            requestError,
                            "Não foi possível carregar as estatísticas. Tente novamente."
                        )
                    );
                }
            })
            .finally(() => {
                if (isCurrentRequest) setLoading(false);
            });

        return () => {
            isCurrentRequest = false;
            controller.abort();
        };
    }, [filters]);

    const periodData = statistics?.byPeriod ?? [];
    const injuryData = statistics
        ? [
            { name: "Com feridos", value: statistics.accidentsWithInjuries },
            { name: "Sem feridos", value: statistics.accidentsWithoutInjuries },
        ].filter((item) => item.value > 0)
        : [];
    const vehicleData = statistics?.byVehicleType.map((item) => ({
        name: getEnumLabel(TypeVehicleLabel, item.value),
        accidentCount: item.accidentCount,
    })) ?? [];
    const locationData = statistics?.byLocation.slice(0, 10).map((item) => ({
        name: [item.district, item.city].filter(Boolean).join(" - ") || "Local não informado",
        count: item.count,
    })) ?? [];

    return (
        <main className="statistics-page">
            <h1>Estatísticas de sinistros</h1>
            <FiltrosEstatisticas onApply={setFilters} />

            {loading && <p className="statistics-status" role="status">Carregando estatísticas...</p>}
            {error && <p className="statistics-error" role="alert">{error}</p>}

            {statistics && !loading && (
                <>
                    <section className="statistics-summary" aria-label="Resumo dos sinistros">
                        <article className="statistics-summary-card">
                            <span>Total de sinistros</span>
                            <strong>{statistics.totalAccidents}</strong>
                        </article>
                        <article className="statistics-summary-card">
                            <span>Com feridos</span>
                            <strong>{statistics.accidentsWithInjuries}</strong>
                        </article>
                        <article className="statistics-summary-card">
                            <span>Sem feridos</span>
                            <strong>{statistics.accidentsWithoutInjuries}</strong>
                        </article>
                        <article className="statistics-summary-card">
                            <span>Percentual com feridos</span>
                            <strong>{statistics.injuryRate.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}%</strong>
                        </article>
                    </section>

                    {statistics.totalAccidents === 0 ? (
                        <p className="statistics-empty" role="status">
                            Nenhum sinistro encontrado para os filtros selecionados.
                        </p>
                    ) : (
                        <section className="statistics-chart-grid" aria-label="Gráficos de sinistros">
                            <ChartPanel title="Evolução de sinistros" hasData={periodData.length > 0} wide>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={periodData} margin={{ top: 10, right: 18, bottom: 4, left: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="periodStart"
                                            tickFormatter={(value) => formatPeriod(String(value), filters.groupBy)}
                                            minTickGap={24}
                                        />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip
                                            labelFormatter={(value) => formatPeriod(String(value), filters.groupBy)}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            name="Sinistros"
                                            stroke="#148a4b"
                                            strokeWidth={3}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartPanel>

                            <ChartPanel
                                title="Tipos de sinistro"
                                hasData={statistics.byAccidentType.length > 0}
                            >
                                <CountBarChart
                                    data={toEnumChartData(statistics.byAccidentType, SinistroTypeLabel)}
                                />
                            </ChartPanel>

                            <ChartPanel title="Com e sem feridos" hasData={injuryData.length > 0}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={injuryData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius="55%"
                                            outerRadius="82%"
                                            paddingAngle={3}
                                        >
                                            {injuryData.map((item, index) => (
                                                <Cell
                                                    key={item.name}
                                                    fill={chartColors[index % chartColors.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartPanel>

                            <ChartPanel title="Condições climáticas" hasData={statistics.byWeather.length > 0}>
                                <CountBarChart data={toEnumChartData(statistics.byWeather, WeatherLabel)} />
                            </ChartPanel>

                            <ChartPanel title="Tipos de via" hasData={statistics.byRoadType.length > 0}>
                                <CountBarChart data={toEnumChartData(statistics.byRoadType, RoadTypeLabel)} />
                            </ChartPanel>

                            <ChartPanel
                                title="Pavimentação"
                                hasData={statistics.byRoadPavementType.length > 0}
                            >
                                <CountBarChart
                                    data={toEnumChartData(statistics.byRoadPavementType, RoadPavementTypeLabel)}
                                />
                            </ChartPanel>

                            <ChartPanel title="Tipo de terreno" hasData={statistics.byGroundType.length > 0}>
                                <CountBarChart data={toEnumChartData(statistics.byGroundType, GroundTypeLabel)} />
                            </ChartPanel>

                            <ChartPanel
                                title="Tipos de veículo"
                                hasData={vehicleData.length > 0}
                                chartHeight={320}
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={vehicleData} margin={{ top: 10, right: 12, bottom: 40, left: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Legend wrapperStyle={{ transform: "translateY(12px)" }} />
                                        <Bar dataKey="accidentCount" name="Sinistros" fill="#148a4b" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartPanel>

                            <ChartPanel title="Sinistros por localidade" hasData={locationData.length > 0} wide>
                                <CountBarChart data={locationData} />
                            </ChartPanel>
                        </section>
                    )}
                </>
            )}
        </main>
    );
}
