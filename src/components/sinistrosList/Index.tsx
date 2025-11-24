import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../Services/Api";
import "./Index.css"
import { Accident } from "../../model/Accident";
import { LoadingMessage } from "../LoadingMessage/Index";
//Enums
import { SinistroTypeLabel } from "../../enums/SinistroType";
import { WeatherLabel } from "../../enums/Weather";

export const SinistrosList = () => {
    const [sinistrosList, SetSinistrosList] = useState<Accident[]>([]);
    const navigate = useNavigate();  

    useEffect(() => {
        const resposteAction = async () => {
            try {
                const response = await Api.get("/sinistros");

                // converte os objetos puros em instâncias de Accident
                const mapped: Accident[] = response.data.map((s: Accident) =>
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
                console.error(err)
            };
        }
        resposteAction();
    }, []);

    if(sinistrosList.length == 0)
        return <LoadingMessage message="Carregando lista de sinistros" />;

    const handleDetails = (id: string) => {
        navigate(`/sinistros/${id}`); // Vai para a rota de detalhes
    };

    return (
        <div className="sinistros-container">
            <h1>Lista de Sinistros</h1>

            <table className="sinistros-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Feridos</th>
                        <th>Tipo</th>
                        <th>Clima</th>
                        
                        <th>Descrição</th>
                        <th>Detalhes</th>
                    </tr>
                </thead>
                <tbody>
                    {sinistrosList.map((s) => (
                        <tr key={s.id}>
                            <td>{new Date(s.date).toLocaleDateString()}</td>
                            <td>{s.injuredPeople ? "Sim" : "Não"}</td>
                            <td>{SinistroTypeLabel[s.sinistroType]}</td>
                            <td>{WeatherLabel[s.weather]}</td>
                            
                            <td>{s.sinistroDescription}</td>
                            <td>
                                <button
                                    onClick={() => handleDetails(s.id)}
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
    );
};