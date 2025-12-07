import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import "./Index.css";
import { Person } from "../../model/Person";
import { Vehicle } from "../../model/Vehicle";
import { Accident } from "../../model/Accident";
import { AccidentAddress } from "../../model/AccidentAddress";
import { MapPicker } from "../localization/SinistroMarker/MapPicker";
import { Api } from "../../Services/Api";
import { MapSinistroApiToModel } from "../../mappers/SinistroMapper";
import { MapAccidentToUpdate } from "../../Services/MapAccidentToUpdate";
import { LoadingMessage } from "../LoadingMessage/Index";

import { SinistroType } from "../../enums/SinistroType";
import { RoadPavementType } from "../../enums/RoadPavementType";
import { RoadType } from "../../enums/RoadType";
import { GroundType } from "../../enums/GroundType";
import { Weather } from "../../enums/Weather";

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

export const SinistroAddressEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { register, handleSubmit, setValue, formState: { errors } } =
        useForm<SinistroFormData>();

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [persons, setPersons] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);

    const [sinistro, setSinistro] = useState<Accident | null>(null);

    useEffect(() => {
        const fetchSinistro = async () => {
            try {
                const response = await Api.get(`/sinistros/${id}`);
                const s = MapSinistroApiToModel(response.data);

                setSinistro(s);
                setPersons(s.peopleEnvolved ?? []);
                setVehicles(s.vehiclesEnvolved ?? []);

                setValue("date", s.date.split("T")[0]);
                setValue("injuredPeople", s.injuredPeople);
                setValue("sinistroType", s.sinistroType);
                setValue("roadPavementType", s.roadPavementType);
                setValue("roadType", s.roadType);
                setValue("groundType", s.groundType);
                setValue("weather", s.weather);
                setValue("accidentDescription", s.sinistroDescription);

                const addr = s.sinistroAddress;

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
            } catch (err) {
                console.error("Erro ao buscar sinistro:", err);
                alert("Erro ao carregar dados do sinistro.");
            } finally {
                setLoading(false);
            }
        };

        fetchSinistro();
    }, [id, setValue]);

    const handleLocationSelect = (latitude: number, longitude: number) => {
        setLat(latitude);
        setLng(longitude);
        setValue("latitude", latitude);
        setValue("longitude", longitude);
    };

    const onSubmit: SubmitHandler<SinistroFormData> = async (data) => {
        setLoading(true);
        try {
            if (!sinistro) return;

            const accidentAddress = new AccidentAddress(
                sinistro.sinistroAddress.Id,
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

            const payload = MapAccidentToUpdate(accident);

            await Api.put(`/sinistros/editarEnderecoSinistro/${id}`, payload);

            alert("Endereço atualizado com sucesso!");
            navigate(`/sinistros/${id}`);
        } catch (error) {
            console.error("Erro ao atualizar sinistro:", error);
            alert("Erro ao atualizar o sinistro. Verifique os dados/API.");
        }
    };

    if (loading) {
        return <LoadingMessage message="Carregando dados do sinistro..." />;
    }

    return (
        <div className="edit-sinistro-container">
            <div className="stander-sinistro-header">
                <h2>Editar Endereço do Sinistro</h2>

                <div className="btn-group">
                    <button onClick={() => navigate(-1)} className="btn-voltar">
                        ← Voltar
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <br />
                <div className="form-group">
                    <label>Rua:</label>
                    <input type="text" {...register("accidentRoad", { required: true })} />
                    {errors.accidentRoad && <span style={{ color: "red" }}>Rua é obrigatória</span>}
                </div>

                <div className="form-group">
                    <label>Número:</label>
                    <input type="text" {...register("accidentNumber", { required: true })} />
                    {errors.accidentNumber && <span style={{ color: "red" }}>Número do enderoço é obrigatório</span>}
                </div>

                <div className="form-group">
                    <label>Complemento:</label>
                    <textarea {...register("accidentAddressComplement")} />
                </div>

                <div className="form-group">
                    <label>CEP:</label>
                    <input type="text" {...register("accidentCep", { required: true })} />
                    {errors.accidentCep && <span style={{ color: "red" }}>CEP é obrigatório</span>}
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

                <h3 className="sub-title">Localização no Mapa</h3>
                <div className="form-group">
                    <MapPicker
                        onLocationSelect={handleLocationSelect}
                        initialLat={lat}
                        initialLng={lng}
                        initialZoom={15}
                    />

                    {lat && lng && (
                        <p style={{ paddingLeft: "10px" }}>
                            Latitude: {lat.toFixed(6)} | Longitude: {lng.toFixed(6)}
                        </p>
                    )}

                    <input type="hidden" {...register("latitude", { valueAsNumber: true })} />
                    <input type="hidden" {...register("longitude", { valueAsNumber: true })} />
                </div>


                <br />
                <div className="form-group" style={{ marginTop: "20px" }}>
                    <button type="submit">Salvar Alterações</button>
                </div>
            </form>
        </div>
    );
};
