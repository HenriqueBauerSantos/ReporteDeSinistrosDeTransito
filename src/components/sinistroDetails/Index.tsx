import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../../Services/Api";
import { Accident } from "../../model/Accident";
import "./Index.css"
import { MapSinistroApiToModel } from "../../mappers/SinistroMapper";
import { SinistroMapViewer } from "../localization/SinistroMapViewer/SinistroMapViewer";
import { LoadingMessage } from "../LoadingMessage/Index";

/* Enums */
import { GroundTypeLabel } from "../../enums/GroundType";
import { RoadPavementTypeLabel } from "../../enums/RoadPavementType";
import { RoadTypeLabel } from "../../enums/RoadType";
import { SinistroTypeLabel } from "../../enums/SinistroType";

export const SinistroDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [sinistro, setSinistro] = useState<Accident | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Api.get(`/sinistros/${id}`);
                const mapped = MapSinistroApiToModel(response.data);
                setSinistro(mapped);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [id]);

    if (!sinistro)
        return <LoadingMessage message="Carregando detalhes do sinistro..." />;

    const address = sinistro.sinistroAddress;
    const people = sinistro.peopleEnvolved || [];

    return (
        <div className="sinistro-details-container">
            <div className="header-sinistro">
                <h2>Detalhes do Sinistro</h2>
                <div className="btn-group">
                    <button onClick={() => navigate(-1)} className="btn-voltar">
                        ← Voltar
                    </button>
                    <button
                        onClick={() => navigate(`/sinistros/editar/${sinistro.id}`)}
                        className="btn-editar"
                    >
                        ✎ Editar
                    </button>
                </div>
            </div>

            <section className="card">
                <h3>Informações Gerais</h3>
                <div className="info-grid">
                    <p><strong>Data:</strong> {new Date(sinistro.date).toLocaleDateString()}</p>
                    <p><strong>Feridos:</strong> {sinistro.injuredPeople ? "Sim" : "Não"}</p>
                    <p><strong>Tipo de Sinistro:</strong> {SinistroTypeLabel[sinistro.sinistroType]}</p>
                    <p><strong>Terreno:</strong> {GroundTypeLabel[sinistro.groundType]}</p>
                    <p><strong>Via:</strong> {RoadTypeLabel[sinistro.roadType]}</p>
                    <p><strong>Pavimento:</strong> {RoadPavementTypeLabel[sinistro.roadPavementType]}</p>
                </div>
                <p className="descricao"><strong>Descrição:</strong> {sinistro.sinistroDescription}</p>
            </section>

            {address && (
                <section className="card">
                    <h3>Local do Sinistro</h3>
                    <div className="info-grid">
                        <p><strong>Rua:</strong> {address.Road}, {address.Number}</p>
                        <p><strong>Bairro:</strong> {address.District}</p>
                        <p><strong>Cidade:</strong> {address.City} - {address.State}</p>
                        <p><strong>CEP:</strong> {address.Cep}</p>
                        {address.Complement && <p><strong>Complemento:</strong> {address.Complement}</p>}
                    </div>
                    <div className="mapa">
                        <SinistroMapViewer
                            latitude={address.Latitude}
                            longitude={address.Longitude}
                            label={`${address.Road}, ${address.Number}`}
                        />
                    </div>
                </section>
            )}

            <section className="card">
                <h3>Pessoas Envolvidas</h3>
                {people.length === 0 ? (
                    <p>Nenhuma pessoa registrada.</p>
                ) : (
                    <table className="tabela-pessoas">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>CPF</th>
                                <th>CNH</th>
                                <th>Data Nasc.</th>
                                <th>Gênero</th>
                            </tr>
                        </thead>
                        <tbody>
                            {people.map((p) => (
                                <tr key={p.Id}>
                                    <td>{p.Name}</td>
                                    <td>{p.CPF}</td>
                                    <td>{p.CNH}</td>
                                    <td>{new Date(p.BirdDate).toLocaleDateString()}</td>
                                    <td>{p.Gender ? "Masculino" : "Feminino"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
};