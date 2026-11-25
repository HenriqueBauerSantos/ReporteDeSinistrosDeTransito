import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api, {
    getApiErrorMessage,
    getApiResponseData,
    getApiResponseList,
    type CustomResponse,
} from "../../Services/Api";
import "./Index.css";
import { Accident } from "../../model/Accident";
import { LoadingMessage } from "../LoadingMessage/Index";

// Enums
import { SinistroTypeLabel } from "../../enums/SinistroType";
import { WeatherLabel } from "../../enums/Weather";
import type { ApiAccident } from "../../mappers/SinistroMapper";

export const SinistrosSolicitacaoList = () => {
    const [solicitacoes, setSolicitacoes] = useState<Accident[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
 
    const carregarSolicitacoes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await Api.get<CustomResponse<Accident[]>>("/sinistros/ListasolicitacaoDeletarSinistro");
            const records = getApiResponseList(response.data, "Erro ao consultar solicitações.");

            const mapped: Accident[] = records.map((s: Accident) =>
                new Accident(
                    s.id,
                    s.date,
                    s.injuredPeople,
                    s.sinistroType,
                    s.roadPavementType,
                    s.roadType,
                    s.groundType,
                    s.weather,
                    s.peopleEnvolved,
                    s.vehiclesEnvolved,
                    s.sinistroAddress,
                    s.sinistroDescription
                )
            );

            setSolicitacoes(mapped);
        } catch (err) {
            console.error(err);
            setError(getApiErrorMessage(err, "Não foi possível carregar as solicitações de exclusão."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarSolicitacoes();
    }, []);

    if (loading)
        return <LoadingMessage message="Carregando solicitações..." />;
    if (error) return <p role="alert">{error}</p>;
    if (solicitacoes.length === 0)
        return <div className="sinistros-container"><h1 className="page-title">Solicitações de Exclusão</h1><p>Nenhuma solicitação encontrada.</p></div>;

    const handleDetails = (id: string) => {
        navigate(`/sinistros/${id}`);
    };

    async function handleDelete(id: string) {
        if (!confirm("Tem certeza que deseja excluir este sinistro?")) return;

        try {
            const response = await Api.delete<CustomResponse<ApiAccident>>(`/sinistros/${id}`);
            getApiResponseData(response.data, "Erro ao excluir sinistro.");
            alert("Sinistro excluído com sucesso!");

            await carregarSolicitacoes();
        } catch (ex) {
            console.error(ex);
            alert(getApiErrorMessage(ex, "Erro ao excluir sinistro."));
        }
    }

    return (
        <div className="sinistros-container">
            <h1 className="page-title">Solicitações de Exclusão</h1>

            <table className="sinistros-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Tipo</th>
                        <th>Clima</th>
                        <th>Descrição</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {solicitacoes.map((s) => (
                        <tr key={s.id}>
                            <td>{new Date(s.date).toLocaleDateString()}</td>
                            <td>{SinistroTypeLabel[s.sinistroType]}</td>
                            <td>{WeatherLabel[s.weather]}</td>
                            <td>{s.sinistroDescription}</td>

                            <td style={{ display: "flex", gap: "8px" }}>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(s.id)}
                                >
                                    Excluir
                                </button>

                                <button
                                    className="btn-detalhes"
                                    onClick={() => handleDetails(s.id)}
                                >
                                    Ver detalhes
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
