import { useState, type FormEvent } from "react";
import { GroundTypeLabel } from "../../enums/GroundType";
import { RoadPavementTypeLabel } from "../../enums/RoadPavementType";
import { RoadTypeLabel } from "../../enums/RoadType";
import { SinistroTypeLabel } from "../../enums/SinistroType";
import { TypeVehicleLabel } from "../../enums/TypeVehicle";
import { WeatherLabel } from "../../enums/Weather";
import type { SinistroEstatisticasFilters } from "../../Services/SinistroEstatisticasService";

type Props = {
    onApply: (filters: SinistroEstatisticasFilters) => void;
};

type NumericFilter =
    | "sinistroType"
    | "typeVehicle"
    | "weather"
    | "roadType"
    | "roadPavementType"
    | "groundType";

const initialFilters: SinistroEstatisticasFilters = { groupBy: "month" };

function EnumFilter({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: number | undefined;
    options: object;
    onChange: (value: number | undefined) => void;
}) {
    const enumOptions = Object.entries(options).flatMap(([optionValue, optionLabel]) =>
        typeof optionLabel === "string" ? [{ value: optionValue, label: optionLabel }] : []
    );

    return (
        <label className="statistics-filter-field">
            <span>{label}</span>
            <select
                value={value ?? ""}
                onChange={(event) =>
                    onChange(event.target.value === "" ? undefined : Number(event.target.value))
                }
            >
                <option value="">Todos</option>
                {enumOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}

export function FiltrosEstatisticas({ onApply }: Props) {
    const [filters, setFilters] = useState<SinistroEstatisticasFilters>(initialFilters);

    function updateNumericFilter(field: NumericFilter, value: number | undefined) {
        setFilters((current) => ({ ...current, [field]: value }));
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onApply({
            ...filters,
            city: filters.city?.trim() || undefined,
            district: filters.district?.trim() || undefined,
        });
    }

    function handleReset() {
        setFilters(initialFilters);
        onApply(initialFilters);
    }

    function updateGroupBy(value: string) {
        if (value === "day" || value === "week" || value === "month") {
            setFilters((current) => ({ ...current, groupBy: value }));
        }
    }

    return (
        <form className="statistics-filters" onSubmit={handleSubmit}>
            <label className="statistics-filter-field">
                <span>Data inicial</span>
                <input
                    type="date"
                    value={filters.dateStart ?? ""}
                    onChange={(event) =>
                        setFilters((current) => ({
                            ...current,
                            dateStart: event.target.value || undefined,
                        }))
                    }
                />
            </label>
            <label className="statistics-filter-field">
                <span>Data final</span>
                <input
                    type="date"
                    value={filters.dateEnd ?? ""}
                    onChange={(event) =>
                        setFilters((current) => ({
                            ...current,
                            dateEnd: event.target.value || undefined,
                        }))
                    }
                />
            </label>
            <label className="statistics-filter-field">
                <span>Agrupar por</span>
                <select
                    value={filters.groupBy ?? "day"}
                    onChange={(event) => updateGroupBy(event.target.value)}
                >
                    <option value="day">Dia</option>
                    <option value="week">Semana</option>
                    <option value="month">Mês</option>
                </select>
            </label>
            <EnumFilter
                label="Tipo de sinistro"
                value={filters.sinistroType}
                options={SinistroTypeLabel}
                onChange={(value) => updateNumericFilter("sinistroType", value)}
            />
            <label className="statistics-filter-field">
                <span>Houve vítimas?</span>
                <select
                    value={filters.injuredPeople === undefined ? "" : String(filters.injuredPeople)}
                    onChange={(event) =>
                        setFilters((current) => ({
                            ...current,
                            injuredPeople:
                                event.target.value === "" ? undefined : event.target.value === "true",
                        }))
                    }
                >
                    <option value="">Todos</option>
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                </select>
            </label>
            <EnumFilter
                label="Tipo de veículo"
                value={filters.typeVehicle}
                options={TypeVehicleLabel}
                onChange={(value) => updateNumericFilter("typeVehicle", value)}
            />
            <EnumFilter
                label="Clima"
                value={filters.weather}
                options={WeatherLabel}
                onChange={(value) => updateNumericFilter("weather", value)}
            />
            <EnumFilter
                label="Tipo de via"
                value={filters.roadType}
                options={RoadTypeLabel}
                onChange={(value) => updateNumericFilter("roadType", value)}
            />
            <EnumFilter
                label="Pavimento"
                value={filters.roadPavementType}
                options={RoadPavementTypeLabel}
                onChange={(value) => updateNumericFilter("roadPavementType", value)}
            />
            <EnumFilter
                label="Terreno"
                value={filters.groundType}
                options={GroundTypeLabel}
                onChange={(value) => updateNumericFilter("groundType", value)}
            />
            <label className="statistics-filter-field">
                <span>Cidade</span>
                <input
                    type="text"
                    value={filters.city ?? ""}
                    onChange={(event) =>
                        setFilters((current) => ({ ...current, city: event.target.value || undefined }))
                    }
                />
            </label>
            <label className="statistics-filter-field">
                <span>Bairro</span>
                <input
                    type="text"
                    value={filters.district ?? ""}
                    onChange={(event) =>
                        setFilters((current) => ({ ...current, district: event.target.value || undefined }))
                    }
                />
            </label>
            <div className="statistics-filter-actions">
                <button type="submit">Aplicar filtros</button>
                <button type="button" className="statistics-filter-reset" onClick={handleReset}>
                    Limpar
                </button>
            </div>
        </form>
    );
}
