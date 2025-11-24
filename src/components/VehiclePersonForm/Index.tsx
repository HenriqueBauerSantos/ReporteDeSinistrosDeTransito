import { useForm, type SubmitHandler } from "react-hook-form";
import { Vehicle } from "../../model/Vehicle";
import { Person } from "../../model/Person";
import { Address } from "../../model/Address";
import { TypeVehicle, TypeVehicleLabel } from "../../enums/TypeVehicle";
import { generateGuid } from "../../Services/GeneralFunctions";
import { v4 as uuidv4 } from "uuid";
import { EnumSelect } from "../GeneralComponents/EnumSelect";

type VehicleFormData = {
    carLisencePlate: string;
    brand: string;
    model: string;
    manufacturingYear: string;
    color: string;
    typeVehicle: TypeVehicle;

    personName: string;
    personBirdDate: string;
    personGender: boolean;
    personCPF: string;
    personRG: string;
    personCNH: string;
    personPhone: string;

    personRoad: string;
    personNumber: string;
    personAddressComplement: string;
    personCep: string;
    personDistrict: string;
    personCity: string;
    personState: string;
};

export const VehicleForm = ({ onSave, onCancel }: { onSave: (v: Vehicle, p: Person) => void, onCancel: () => void }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<VehicleFormData>();

    const onSubmit: SubmitHandler<VehicleFormData> = async (data) => {
        const vehicle = new Vehicle(
            uuidv4(),
            data.carLisencePlate,
            data.brand,
            data.model,
            new Date(data.manufacturingYear),
            data.color,
            data.typeVehicle
        );

        const personAddress = new Address(
            uuidv4(),
            data.personRoad,
            data.personNumber,
            data.personAddressComplement,
            data.personCep,
            data.personDistrict,
            data.personCity,
            data.personState
        );

        const person = new Person(
            generateGuid(),
            data.personName,
            data.personBirdDate,
            data.personGender,
            data.personCPF,
            data.personRG,
            data.personCNH,
            data.personPhone,
            personAddress
        );

        onSave(vehicle, person);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="app-container">
            <br />

            <h3>Adicionar Veículo</h3>

            <div className="form-group">
                <label>Placa</label>
                <input
                    type="text"
                    {...register("carLisencePlate", { required: true, minLength: 7 })}
                />
                {errors.carLisencePlate?.type === 'required' && <span style={{ color: "red" }}>Placa do veículo é obrigatória</span>}
                {errors.carLisencePlate?.type === 'minLength' && <span style={{ color: "red" }}>Placa do veículo deve ter 7 caracteres</span>}
            </div>

            <div className="form-group">
                <label>Marca</label>
                <input
                    type="text"
                    {...register("brand", { required: true, minLength: 2 })}
                />
                {errors.brand?.type === 'required' && <span style={{ color: "red" }}>Marca do veículo é obrigatória</span>}
                {errors.brand?.type === 'minLength' && <span style={{ color: "red" }}>Marca do veículo deve ter no mínimo 2 caracteres</span>}
            </div>

            <div className="form-group">
                <label>Modelo</label>
                <input
                    type="text"
                    {...register("model", { required: true, minLength: 2 })}
                />
                {errors.model?.type === 'required' && <span style={{ color: "red" }}>Modelo do veículo é obrigatório</span>}
                {errors.model?.type === 'minLength' && <span style={{ color: "red" }}>Modelo do veículo deve ter no mínimo 2 caracteres</span>}
            </div>

            <div className="form-group">
                <label>Ano de Fabricação</label>
                <input
                    type="date"
                    {...register("manufacturingYear", { required: true })}
                />
                {errors.manufacturingYear?.type === 'required' && <span style={{ color: "red" }}>Ano de fabricação do veículo é obrigatório</span>}
            </div>

            <div className="form-group">
                <label>Cor</label>
                <input
                    type="text"
                    {...register("color", { required: true })}
                />
                {errors.color?.type === 'required' && <span style={{ color: "red" }}>Cor do veículo é obrigatório</span>}
            </div>

            <EnumSelect<VehicleFormData, typeof TypeVehicle> label="Tipo do Veículo" enumObj={TypeVehicle} enumLabels={TypeVehicleLabel}
                fieldName="typeVehicle" register={register} errors={errors} />

            <h3>Dados do Condutor</h3>
            <div className="form-group">
                <label>Nome</label>
                <input
                    type="text"
                    {...register("personName", { required: true })}
                />
                {errors.personName?.type === 'required' && <span style={{ color: "red" }}>Nome do condutor é obrigatório</span>}
            </div>

            <div className="form-group">
                <label>Data de Nascimento</label>
                <input
                    type="date"
                    {...register("personBirdDate", { required: true })}
                />
                {errors.personBirdDate?.type === 'required' && <span style={{ color: "red" }}>Data de nascimento é obrigatório</span>}
            </div>

            <div className="form-group">
                <label>Gênero</label>
                <select {...register("personGender", { setValueAs: (v) => v === "true" })}>
                    <option value="true">Masculino</option>
                    <option value="false">Feminino</option>
                </select>
            </div>

            <div className="form-group">
                <label>CPF</label>
                <input
                    type="text"
                    {...register("personCPF", { required: true, minLength: 11 })}
                />
                {errors.personCPF?.type === 'required' && <span style={{ color: "red" }}>CPF é obrigatório</span>}
                {errors.personCPF?.type === 'minLength' && <span style={{ color: "red" }}>CPF deve ter 11 caracteres</span>}
            </div>

            <div className="form-group">
                <label>RG</label>
                <input
                    type="text"
                    {...register("personRG", { required: true, minLength: 8 })}
                />
                {errors.personRG?.type === 'required' && <span style={{ color: "red" }}>RG é obrigatório</span>}
                {errors.personRG?.type === 'minLength' && <span style={{ color: "red" }}>RG deve ter 8 caracteres</span>}
            </div>

            <div className="form-group">
                <label>CNH</label>
                <input
                    type="text"
                    {...register("personCNH", { required: true, minLength: 9 })}
                />
                {errors.personCNH?.type === 'required' && <span style={{ color: "red" }}>CNH é obrigatória</span>}
                {errors.personCNH?.type === 'minLength' && <span style={{ color: "red" }}>CNH deve ter 9 caracteres</span>}
            </div>

            <div className="form-group">
                <label>Telefone</label>
                <input
                    type="text"
                    {...register("personPhone", { required: true })}
                />
                {errors.personPhone?.type === 'required' && <span style={{ color: "red" }}>Telefone é obrigatório</span>}
            </div>

            <h4>Endereço do Condutor</h4>
            <div className="form-group">
                <label>Rua</label>
                <input
                    type="text"
                    {...register("personRoad", { required: true })}
                />
                {errors.personRoad?.type === 'required' && <span style={{ color: "red" }}>Rua é obrigatório</span>}
            </div>

            <div className="form-group">
                <label>Número</label>
                <input
                    type="text"
                    {...register("personNumber", { required: true })}
                />
                {errors.personNumber?.type === 'required' && <span style={{ color: "red" }}>Número é obrigatório</span>}
            </div>

            <div className="form-group">
                <label>Complemento:</label>
                <textarea {...register("personAddressComplement")} placeholder="Complemento" />
            </div>

            <div className="form-group">
                <label>CEP</label>
                <input
                    type="text"
                    {...register("personCep", { required: true, minLength: 8 })}
                />
                {errors.personCep?.type === 'required' && <span style={{ color: "red" }}>CEP é obrigatório</span>}
                {errors.personCep?.type === 'minLength' && <span style={{ color: "red" }}>CEP deve ter 8 caracteres</span>}
            </div>

            <div className="form-group">
                <label>Bairro</label>
                <input
                    type="text"
                    {...register("personDistrict", { required: true })}
                />
                {errors.personDistrict?.type === 'required' && <span style={{ color: "red" }}>Bairro é obrigatório</span>}
            </div>

            <div className="form-group">
                <label>Cidade</label>
                <input
                    type="text"
                    {...register("personCity", { required: true })}
                />
                {errors.personCity?.type === 'required' && <span style={{ color: "red" }}>Cidade é obrigatório</span>}
            </div>

            <div className="form-group">
                <label>Estado</label>
                <input
                    type="text"
                    {...register("personState", { required: true })}
                />
                {errors.personState?.type === 'required' && <span style={{ color: "red" }}>Estado é obrigatório</span>}
            </div>

            <div className="form-actions">
                <button type="submit">Salvar Veículo</button>
                <button type="button" onClick={onCancel}>Cancelar</button>
            </div>
        </form>

    );
};
