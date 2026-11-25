import { useMemo, useState } from "react";
import { SinistroTypeLabel } from "../../enums/SinistroType";
import { WeatherLabel } from "../../enums/Weather";
import type { Accident } from "../../model/Accident";
import "./Index.css";

type SortColumn = "date" | "injuredPeople" | "sinistroType" | "weather";
type SortDirection = "asc" | "desc";

const PAGE_SIZE = 25;

function compareDates(first: string, second: string) {
    const firstTime = Date.parse(first);
    const secondTime = Date.parse(second);

    if (Number.isNaN(firstTime) || Number.isNaN(secondTime)) {
        return first.localeCompare(second, "pt-BR");
    }

    return firstTime - secondTime;
}

export function SinistrosTable({
    sinistros,
    onDetails,
}: {
    sinistros: Accident[];
    onDetails: (id: string) => void;
}) {
    const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [page, setPage] = useState(1);

    const sortedSinistros = useMemo(() => {
        if (!sortColumn) return sinistros;

        return [...sinistros].sort((first, second) => {
            let comparison: number;

            switch (sortColumn) {
                case "date":
                    comparison = compareDates(first.date, second.date);
                    break;
                case "injuredPeople":
                    comparison = Number(first.injuredPeople) - Number(second.injuredPeople);
                    break;
                case "sinistroType":
                    comparison = SinistroTypeLabel[first.sinistroType].localeCompare(
                        SinistroTypeLabel[second.sinistroType],
                        "pt-BR",
                    );
                    break;
                case "weather":
                    comparison = WeatherLabel[first.weather].localeCompare(
                        WeatherLabel[second.weather],
                        "pt-BR",
                    );
                    break;
            }

            return sortDirection === "asc" ? comparison : -comparison;
        });
    }, [sinistros, sortColumn, sortDirection]);

    const totalPages = Math.ceil(sortedSinistros.length / PAGE_SIZE);
    const firstRecord = (page - 1) * PAGE_SIZE;
    const pageSinistros = sortedSinistros.slice(firstRecord, firstRecord + PAGE_SIZE);

    const handleSort = (column: SortColumn) => {
        if (sortColumn === column) {
            setSortDirection((direction) => direction === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
        setPage(1);
    };

    const sortButton = (column: SortColumn, label: string) => (
        <button type="button" className="sinistros-sort-button" onClick={() => handleSort(column)}>
            {label}
            <span aria-hidden="true">
                {sortColumn === column ? (sortDirection === "asc" ? " ▲" : " ▼") : " ↕"}
            </span>
        </button>
    );

    return (
        <>
            <div className="sinistros-table-wrapper">
                <table className="sinistros-table sinistros-records-table">
                    <thead>
                        <tr>
                            <th aria-sort={sortColumn === "date" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}>
                                {sortButton("date", "Data")}
                            </th>
                            <th aria-sort={sortColumn === "injuredPeople" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}>
                                {sortButton("injuredPeople", "Feridos")}
                            </th>
                            <th aria-sort={sortColumn === "sinistroType" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}>
                                {sortButton("sinistroType", "Tipo")}
                            </th>
                            <th aria-sort={sortColumn === "weather" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}>
                                {sortButton("weather", "Clima")}
                            </th>
                            <th>Descrição</th>
                            <th>Detalhes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageSinistros.map((sinistro) => (
                            <tr key={sinistro.id}>
                                <td data-label="Data">{new Date(sinistro.date).toLocaleDateString()}</td>
                                <td data-label="Feridos">{sinistro.injuredPeople ? "Sim" : "Não"}</td>
                                <td data-label="Tipo">{SinistroTypeLabel[sinistro.sinistroType]}</td>
                                <td data-label="Clima">{WeatherLabel[sinistro.weather]}</td>
                                <td data-label="Descrição">{sinistro.sinistroDescription}</td>
                                <td data-label="Detalhes">
                                    <button
                                        onClick={() => onDetails(sinistro.id)}
                                        className="btn-detalhes"
                                    >
                                        Ver detalhes
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="sinistros-pagination" aria-label="Paginação da lista de sinistros">
                <span>
                    Exibindo {firstRecord + 1}–{Math.min(firstRecord + PAGE_SIZE, sortedSinistros.length)} de {sortedSinistros.length}
                    {" "}registros — Página {page} de {totalPages}
                </span>
                <div>
                    <button type="button" onClick={() => setPage((current) => current - 1)} disabled={page === 1}>
                        Anterior
                    </button>
                    <button type="button" onClick={() => setPage((current) => current + 1)} disabled={page === totalPages}>
                        Próxima
                    </button>
                </div>
            </div>
        </>
    );
}
