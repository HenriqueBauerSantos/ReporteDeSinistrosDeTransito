import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import "./Index.css";
import { Person } from "../../model/Person";
import { Vehicle } from "../../model/Vehicle";
import { Accident } from "../../model/Accident";
import { AccidentAddress } from "../../model/AccidentAddress";
import { MapPicker } from "../localization/SinistroMarker/MapPicker";
import { VehiclePersonManager } from "../VehiclePersonManager/Index";
import { Api } from "../../Services/Api";
import { mapAccidentToApi } from "../../Services/MapAccidentToApi";
import { MapSinistroApiToModel } from "../../mappers/SinistroMapper";
import { v4 as uuidv4 } from "uuid";

/* Enums */
import { SinistroType, SinistroTypeLabel } from "../../enums/SinistroType";
import { RoadPavementType, RoadPavementTypeLabel } from "../../enums/RoadPavementType";
import { RoadType, RoadTypeLabel } from "../../enums/RoadType";
import { GroundType, GroundTypeLabel } from "../../enums/GroundType";
import { Weather, WeatherLabel } from "../../enums/Weather";
import { EnumSelect } from "../GeneralComponents/EnumSelect";
import { LoadingMessage } from "../LoadingMessage/Index";

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
    latitude: number;
    longitude: number;
};

export const SinistroEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<SinistroFormData>();

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [persons, setPersons] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);

    /* Carregar dados existentes do sinistro */
    useEffect(() => {
        const fetchSinistro = async () => {
            try {
                const response = await Api.get(`/sinistros/${id}`);
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

                // Endereço
                const addr = sinistro.sinistroAddress;
                if (addr) {
                    setValue("accidentRoad", addr.Road);
                    setValue("accidentNumber", addr.Number);
                    setValue("accidentAddressComplement", addr.Complement ?? "");
                    setValue("accidentCep", addr.Cep);
                    setValue("accidentDistrict", addr.District);
                    setValue("accidentCity", addr.City);
                    setValue("accidentState", addr.State);
                    setValue("latitude", addr.Latitude);
                    setValue("longitude", addr.Longitude);
                    setLat(addr.Latitude);
                    setLng(addr.Longitude);
                }

                // Pessoas e veículos
                setPersons(sinistro.peopleEnvolved ?? []);
                setVehicles(sinistro.vehiclesEnvolved ?? []);

            } catch (err) {
                console.error("Erro ao buscar sinistro:", err);
                alert("Erro ao carregar dados do sinistro.");
            } finally {
                setLoading(false);
            }
        };

        fetchSinistro();
    }, [id, setValue]);

    /* Mapa */
    const handleLocationSelect = (latitude: number, longitude: number) => {
        setLat(latitude);
        setLng(longitude);
        setValue("latitude", latitude);
        setValue("longitude", longitude);
    };

    /* Envio do formulário */
    const onSubmit: SubmitHandler<SinistroFormData> = async (data) => {
        try {
            const accidentAddress = new AccidentAddress(
                uuidv4(),
                data.accidentRoad,
                data.accidentNumber,
                data.accidentAddressComplement,
                data.accidentCep,
                data.accidentDistrict,
                data.accidentCity,
                data.accidentState,
                data.latitude,
                data.longitude
            );

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
                accidentAddress,
                data.accidentDescription
            );

            const payload = mapAccidentToApi(accident);

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
        <div className="sinistro-Form-component">
            <form className="app-container" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="sub-title">Editar Sinistro</h2>

                {/* Dados principais */}
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

                {/* Endereço */}
                <h3 className="sub-title">Endereço do Acidente</h3>
                <div className="form-group">
                    <label>Rua:</label>
                    <input type="text" {...register("accidentRoad", { required: true })} />
                </div>
                <div className="form-group">
                    <label>Número:</label>
                    <input type="text" {...register("accidentNumber", { required: true })} />
                </div>
                <div className="form-group">
                    <label>Complemento:</label>
                    <textarea {...register("accidentAddressComplement")} />
                </div>
                <div className="form-group">
                    <label>CEP:</label>
                    <input type="text" {...register("accidentCep", { required: true })} />
                </div>
                <div className="form-group">
                    <label>Bairro:</label>
                    <input type="text" {...register("accidentDistrict", { required: true })} />
                </div>
                <div className="form-group">
                    <label>Cidade:</label>
                    <input type="text" {...register("accidentCity", { required: true })} />
                </div>
                <div className="form-group">
                    <label>Estado:</label>
                    <input type="text" {...register("accidentState", { required: true })} />
                </div>

                {/* Localização */}
                <h3 className="sub-title">Localização do Acidente</h3>
                <div className="form-group">
                    <MapPicker
                        onLocationSelect={handleLocationSelect}
                        initialLat={lat}
                        initialLng={lng}
                        initialZoom={15}
                    />
                    {lat && lng && (
                        <div style={{ padding: "10px 0 0 15px" }}>
                            <p>Latitude: {lat.toFixed(6)}, Longitude: {lng.toFixed(6)}</p>
                        </div>
                    )}
                </div>

                <input type="hidden" {...register("latitude", { valueAsNumber: true, required: true })} />
                <input type="hidden" {...register("longitude", { valueAsNumber: true })} />

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
                />

                <br />
                <div className="form-group" style={{ marginTop: "20px" }}>
                    <button type="submit">Salvar Alterações</button>
                </div>
            </form>
        </div>
    );
};
