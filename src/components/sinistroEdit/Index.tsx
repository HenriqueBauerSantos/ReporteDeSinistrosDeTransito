import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import "./Index.css";
import { Person } from "../../model/Person";
import { Vehicle } from "../../model/Vehicle";
import { Accident } from "../../model/Accident";
import { AccidentAddress } from "../../model/AccidentAddress";
import { VehiclePersonManager } from "../VehiclePersonManager/Index";
import { Api } from "../../Services/Api";
import { MapSinistroApiToModel } from "../../mappers/SinistroMapper";
import { VehiclePersonModal } from "../VehiclePersonForm/SinistroPersonModal";

/* Enums */
import { SinistroType, SinistroTypeLabel } from "../../enums/SinistroType";
import { RoadPavementType, RoadPavementTypeLabel } from "../../enums/RoadPavementType";
import { RoadType, RoadTypeLabel } from "../../enums/RoadType";
import { GroundType, GroundTypeLabel } from "../../enums/GroundType";
import { Weather, WeatherLabel } from "../../enums/Weather";
import { EnumSelect } from "../GeneralComponents/EnumSelect";
import { LoadingMessage } from "../LoadingMessage/Index";
import { MapAccidentToUpdate } from "../../Services/MapAccidentToUpdate";

/* Tipo do formulário */
type SinistroFormData = {
    date: string;
    injuredPeople: boolean;
    accidentRoad: string;
    accidentNumber: string;
    accidentAddressComplement: string;
    accidentCep: string;
    accidentDistrict: string;
    accidentCity: string;
    accidentState: string;
    accidentDescription: string;
    sinistroType: SinistroType;
    roadPavementType: RoadPavementType;
    roadType: RoadType;
    groundType: GroundType;
    weather: Weather;

};

export const SinistroEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<SinistroFormData>();

    const [accidentAddress, setAccidentAddress] = useState<AccidentAddress | null>(null);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [persons, setPersons] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);

    const [showVehicleForm, setShowVehicleForm] = useState(false);

    /* Carregar dados existentes do sinistro */
    useEffect(() => {
        const fetchSinistro = async () => {
            try {
                const response = await Api.get(`/sinistros/${id}`);
                console.log("API sinistro:", response.data);
                const sinistro = MapSinistroApiToModel(response.data);


                // Preencher campos do formulário
                setValue("date", sinistro.date.split("T")[0]);
                setValue("injuredPeople", sinistro.injuredPeople);
                setValue("sinistroType", sinistro.sinistroType);
                setValue("roadPavementType", sinistro.roadPavementType);
                setValue("roadType", sinistro.roadType);
                setValue("groundType", sinistro.groundType);
                setValue("weather", sinistro.weather);
                setValue("accidentDescription", sinistro.sinistroDescription);

                // Pessoas e veículos
                setPersons(sinistro.peopleEnvolved ?? []);
                setVehicles(sinistro.vehiclesEnvolved ?? []);

                //Endereço
                setAccidentAddress(sinistro.sinistroAddress);

            } catch (err) {
                console.error("Erro ao buscar sinistro:", err);
                alert("Erro ao carregar dados do sinistro.");
            } finally {
                setLoading(false);
            }
        };

        fetchSinistro();
    }, [id, setValue]);

    /* Envio do formulário */
    const onSubmit: SubmitHandler<SinistroFormData> = async (data) => {
        setLoading(true);
        try {
            const accident = new Accident(
                id ?? "",
                data.date,
                data.injuredPeople,
                data.sinistroType,
                data.roadPavementType,
                data.roadType,
                data.groundType,
                data.weather,
                persons,
                vehicles,
                accidentAddress!,
                data.accidentDescription
            );

            console.log("Acidente ID:", accident.id);
            const payload = MapAccidentToUpdate(accident);
            console.log("📤 Payload enviado:", payload);

            const response = await Api.put(`/sinistros/${id}`, payload);
            console.log("✅ Sinistro atualizado:", response.data);
            alert("Sinistro atualizado com sucesso!");
            navigate(`/sinistros/${id}`);
        } catch (error) {
            console.error("Erro ao atualizar sinistro:", error);
            alert("Erro ao atualizar o sinistro. Verifique os dados/API.");
        }
    };

    if (loading) return <LoadingMessage message="Carregando dados do sinistro..." />;

    return (
        <div className="edit-sinistro-container">
            <div className="stander-sinistro-header">
                <h2>Editar Sinistro</h2>

                <div className="btn-group">
                    <button onClick={() => navigate(-1)} className="btn-voltar">
                        ← Voltar
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Data:</label>
                    <input type="date" {...register("date", { required: true })} />
                    {errors.date && <span style={{ color: "red" }}>Data é obrigatória</span>}
                </div>

                <div className="form-group">
                    <label>Feridos:</label>
                    <select {...register("injuredPeople", { required: true })}>
                        <option value="false">Não</option>
                        <option value="true">Sim</option>
                    </select>
                </div>

                <EnumSelect<SinistroFormData, typeof SinistroType>
                    label="Tipo de Sinistro"
                    enumObj={SinistroType}
                    enumLabels={SinistroTypeLabel}
                    fieldName="sinistroType"
                    register={register}
                    errors={errors}
                />

                <EnumSelect<SinistroFormData, typeof RoadPavementType>
                    label="Pavimento"
                    enumObj={RoadPavementType}
                    enumLabels={RoadPavementTypeLabel}
                    fieldName="roadPavementType"
                    register={register}
                    errors={errors}
                />

                <EnumSelect<SinistroFormData, typeof RoadType>
                    label="Tipo de Via"
                    enumObj={RoadType}
                    enumLabels={RoadTypeLabel}
                    fieldName="roadType"
                    register={register}
                    errors={errors}
                />

                <EnumSelect<SinistroFormData, typeof GroundType>
                    label="Terreno"
                    enumObj={GroundType}
                    enumLabels={GroundTypeLabel}
                    fieldName="groundType"
                    register={register}
                    errors={errors}
                />

                <EnumSelect<SinistroFormData, typeof Weather>
                    label="Clima"
                    enumObj={Weather}
                    enumLabels={WeatherLabel}
                    fieldName="weather"
                    register={register}
                    errors={errors}
                />

                <div className="form-group">
                    <label>Descrição:</label>
                    <textarea {...register("accidentDescription", { required: true })} />
                </div>

                <VehiclePersonManager
                    vehicles={vehicles}
                    persons={persons}
                    onChange={(newVehicles, newPersons) => {
                        setVehicles(newVehicles);
                        setPersons(newPersons);
                    }}
                    onAddVehicle={() => setShowVehicleForm(true)}
                />

                <br />
                <div className="form-group" style={{ marginTop: "20px" }}>
                    <button type="submit">Salvar Alterações</button>
                </div>
            </form>

            {/* Modal Vehicle - Portal */}
            {showVehicleForm && (
                <VehiclePersonModal
                    onSave={(vehicle, person) => {
                        setVehicles(prev => [...prev, vehicle]);
                        setPersons(prev => [...prev, person]);
                        setShowVehicleForm(false);
                    }}
                    onCancel={() => setShowVehicleForm(false)}
                />
            )}
        </div>
    );
};
