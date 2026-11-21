import { useState, type FormEvent } from "react";
import { GroundTypeLabel } from "../../../enums/GroundType";
import { RoadPavementTypeLabel } from "../../../enums/RoadPavementType";
import { RoadTypeLabel } from "../../../enums/RoadType";
import { SinistroTypeLabel } from "../../../enums/SinistroType";
import { TypeVehicleLabel } from "../../../enums/TypeVehicle";
import { WeatherLabel } from "../../../enums/Weather";
import type { SinistroMapaFilters } from "../../../Services/SinistroMapaService";

type FiltrosMapaProps = {
    onApply: (filters: SinistroMapaFilters) => void;
};

type NumericFilter =
    | "sinistroType"
    | "typeVehicle"
    | "weather"
    | "roadType"
    | "roadPavementType"
    | "groundType";

function EnumFilter({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: number | undefined;
    options: Record<number, string>;
    onChange: (value: number | undefined) => void;
}) {
    return (
        <label className="map-filter-field">
            <span>{label}</span>
            <select
                value={value ?? ""}
                onChange={(event) =>
                    onChange(event.target.value === "" ? undefined : Number(event.target.value))
                }
            >
                <option value="">Todos</option>
                {Object.entries(options).map(([optionValue, optionLabel]) => (
                    <option key={optionValue} value={optionValue}>
                        {optionLabel}
                    </option>
                ))}
            </select>
        </label>
    );
}

export function FiltrosMapa({ onApply }: FiltrosMapaProps) {
    const [filters, setFilters] = useState<SinistroMapaFilters>({});

    function updateNumericFilter(field: NumericFilter, value: number | undefined) {
        setFilters((current) => ({ ...current, [field]: value }));
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onApply(filters);
    }

    function handleReset() {
        const emptyFilters: SinistroMapaFilters = {};
        setFilters(emptyFilters);
        onApply(emptyFilters);
    }

    return (
        <form className="map-filters" onSubmit={handleSubmit}>
            <label className="map-filter-field">
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
            <label className="map-filter-field">
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
            <EnumFilter
                label="Tipo de sinistro"
                value={filters.sinistroType}
                options={SinistroTypeLabel}
                onChange={(value) => updateNumericFilter("sinistroType", value)}
            />
            <label className="map-filter-field">
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
            <div className="map-filter-actions">
                <button type="submit">Aplicar filtros</button>
                <button type="button" className="map-filter-reset" onClick={handleReset}>
                    Limpar
                </button>
            </div>
        </form>
    );
}
