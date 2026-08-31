import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import './Index.css';
import { Person } from "../../model/Person";
import { Vehicle } from "../../model/Vehicle";
import { Accident } from "../../model/Accident";
import { AccidentAddress } from "../../model/AccidentAddress";
import { MapPicker } from "../localization/SinistroMarker/MapPicker";
import { Api } from "../../Services/Api";
import { SinistroType, SinistroTypeLabel } from "../../enums/SinistroType";
import { RoadPavementType, RoadPavementTypeLabel } from "../../enums/RoadPavementType";
import { RoadType, RoadTypeLabel } from "../../enums/RoadType";
import { GroundType, GroundTypeLabel } from "../../enums/GroundType";
import { Weather, WeatherLabel } from "../../enums/Weather";
import { VehiclePersonManager } from "../VehiclePersonManager/Index";
import { mapAccidentToApi } from "../../Services/MapAccidentToApi";
import { v4 as uuidv4 } from "uuid";
import { EnumSelect } from "../GeneralComponents/EnumSelect";
import { VehiclePersonModal } from "../VehiclePersonForm/SinistroPersonModal";
import { useNavigate } from "react-router-dom";

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

export const SinistroForm = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<SinistroFormData>();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [persons, setPersons] = useState<Person[]>([]);
    const navigate = useNavigate();

    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);

    // Modal Vehicle
    const [showVehicleForm, setShowVehicleForm] = useState(false);

    const handleLocationSelect = (latitude: number, longitude: number) => {
        setLat(latitude);
        setLng(longitude);
        setValue("latitude", latitude);
        setValue("longitude", longitude);
    };

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
                "biacjain",
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
            console.log("📤 Payload enviado:", payload);

            const response = await Api.post("/sinistros", payload);
            console.log("✅ Sinistro cadastrado:", response.data);
            alert("Sinistro cadastrado com sucesso!");

            setVehicles([]);
            setPersons([]);
            navigate(`/sobre`);

        } catch (error) {
            console.error("Erro ao cadastrar sinistro:", error);
            alert("Erro ao cadastrar sinistro. Verifique os dados/API.");
        }
    };

    return (
        <div className="sinistro-Form-component">
            <form className="app-container" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="sub-title">Dados do sinistro</h2>

                <div className="form-group">
                    <label>Data:</label>
                    <input type="date" {...register("date", { required: true })} />
                    {errors.date && <span style={{ color: "red" }}>Data é obrigatória</span>}
                </div>

                <div className="form-group">
                    <label>Alguém ferido:</label>
                    <select {...register("injuredPeople", { setValueAs: (v) => v === "true" })}>
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
                    errors={errors} />

                <EnumSelect<SinistroFormData, typeof RoadPavementType>
                    label="Pavimento"
                    enumObj={RoadPavementType}
                    enumLabels={RoadPavementTypeLabel}
                    fieldName="roadPavementType"
                    register={register}
                    errors={errors} />

                <EnumSelect<SinistroFormData, typeof RoadType>
                    label="Tipo de Via"
                    enumObj={RoadType}
                    enumLabels={RoadTypeLabel}
                    fieldName="roadType"
                    register={register}
                    errors={errors} />

                <EnumSelect<SinistroFormData, typeof GroundType>
                    label="Terreno"
                    enumObj={GroundType}
                    enumLabels={GroundTypeLabel}
                    fieldName="groundType"
                    register={register}
                    errors={errors} />

                <EnumSelect<SinistroFormData, typeof Weather>
                    label="Clima"
                    enumObj={Weather}
                    enumLabels={WeatherLabel}
                    fieldName="weather"
                    register={register}
                    errors={errors} />

                <h3 className="sub-title">Endereço do Acidente</h3>

                <div className="form-group">
                    <label>Rua:</label>
                    <input type="text" {...register("accidentRoad", { required: true })} />
                    {errors.accidentRoad && <span style={{ color: "red" }}>Rua do sinistro é obrigatória</span>}
                </div>

                <div className="form-group">
                    <label>Número:</label>
                    <input type="text" {...register("accidentNumber", { required: true })} />
                    {errors.accidentNumber && <span style={{ color: "red" }}>Número do endereço é obrigatória</span>}
                </div>

                <div className="form-group">
                    <label>Complemento:</label>
                    <textarea {...register("accidentAddressComplement")} placeholder="Complemento" />
                </div>

                <div className="form-group">
                    <label>CEP:</label>
                    <input type="text" {...register("accidentCep", { required: true, minLength: 8 })} />
                    {errors.accidentCep?.type === 'required' && <span style={{ color: "red" }}>CEP é obrigatório</span>}
                    {errors.accidentCep?.type === 'minLength' && <span style={{ color: "red" }}>CEP deve ter 8 caracteres</span>}
                </div>

                <div className="form-group">
                    <label>Bairro:</label>
                    <input type="text" {...register("accidentDistrict", { required: true })} />
                    {errors.accidentDistrict && <span style={{ color: "red" }}>Bairro é obrigatório</span>}
                </div>

                <div className="form-group">
                    <label>Cidade:</label>
                    <input type="text" {...register("accidentCity", { required: true })} />
                    {errors.accidentCity && <span style={{ color: "red" }}>Cidade é obrigatória</span>}
                </div>

                <div className="form-group">
                    <label>Estado:</label>
                    <input type="text" {...register("accidentState", { required: true })} />
                    {errors.accidentState && <span style={{ color: "red" }}>Estado é obrigatório</span>}
                </div>

                <h2 className="sub-title">Localização do Acidente</h2>
                <div className="form-group">
                    <MapPicker onLocationSelect={handleLocationSelect} />
                    {lat && lng && <p>Latitude: {lat.toFixed(6)}, Longitude: {lng.toFixed(6)}</p>}
                </div>

                <input type="hidden" {...register("latitude", { valueAsNumber: true, required: true })} />
                <input type="hidden" {...register("longitude", { valueAsNumber: true })} />

                <div className="form-group">
                    <label>Descrição do acidente:</label>
                    <textarea {...register("accidentDescription", { required: true })} />
                </div>

                {/* Vehicle Manager */}
                <VehiclePersonManager
                    vehicles={vehicles}
                    persons={persons}
                    onChange={(newVehicles, newPersons) => {
                        setVehicles(newVehicles);
                        setPersons(newPersons);
                    }}
                    onAddVehicle={() => setShowVehicleForm(true)}
                />

                <div className="form-group">
                    <button type="submit">Cadastrar Sinistro</button>
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
