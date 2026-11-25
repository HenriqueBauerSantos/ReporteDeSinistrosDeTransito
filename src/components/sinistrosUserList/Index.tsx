import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api, { getApiErrorMessage, getApiResponseList, type CustomResponse } from "../../Services/Api";
import "./Index.css"
import { Accident } from "../../model/Accident";
import { LoadingMessage } from "../LoadingMessage/Index";
import { SinistrosTable } from "../SinistrosTable/Index";

export const SinistrosUserList = () => {
    const [sinistrosList, SetSinistrosList] = useState<Accident[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();  

    useEffect(() => {
        const resposteAction = async () => {
            try {
                const response = await Api.get<CustomResponse<Accident[]>>("/sinistros/meus-registros");
                const records = getApiResponseList(response.data, "Erro ao consultar seus sinistros.");

                // converte os objetos puros em instâncias de Accident
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

                SetSinistrosList(mapped);
            } catch (err) {
                console.error(err);
                setError(getApiErrorMessage(err, "Não foi possível carregar sua lista de sinistros."));
            } finally {
                setLoading(false);
            }
        }
        resposteAction();
    }, []);

    if (loading)
        return <LoadingMessage message="Carregando lista de sinistros" />;
    if (error) return <p role="alert">{error}</p>;
    if (sinistrosList.length === 0)
        return <div className="sinistros-container"><h1 className="page-title">Lista de Sinistros</h1><p>Nenhum sinistro encontrado.</p></div>;

    const handleDetails = (id: string) => {
        navigate(`/sinistros/${id}`); // Vai para a rota de detalhes
    };

    return (
        <div className="sinistros-container">
            <h1 className="page-title">Lista de Sinistros</h1>
            <SinistrosTable sinistros={sinistrosList} onDetails={handleDetails} />
        </div>
    );
};