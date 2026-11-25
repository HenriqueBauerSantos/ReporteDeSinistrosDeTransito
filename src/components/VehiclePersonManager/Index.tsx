import { Vehicle } from "../../model/Vehicle";
import { Person } from "../../model/Person";
import { TypeVehicleLabel } from "../../enums/TypeVehicle";
import "./Index.css";

type VehiclePersonManagerProps = {
    vehicles: Vehicle[];
    persons: Person[];
    onChange: (vehicles: Vehicle[], persons: Person[]) => void;
    onAddVehicle: () => void;
};

export function VehiclePersonManager({ vehicles, persons, onChange, onAddVehicle }: VehiclePersonManagerProps) {
    const handleDelete = (plate: string) => {
        const newVehicles = vehicles.filter(v => v.CarLisencePlate !== plate);
        const newPersons = persons.filter((_, i) => vehicles[i].CarLisencePlate !== plate);
        onChange(newVehicles, newPersons);
    };

    return (
        <div className="vehicle-person-manager">
            <h3>Veículos e Condutores</h3>

            {vehicles.length === 0 && <p className="no-vehicles">Nenhum veículo adicionado.</p>}

            <ul className="vehicles-list">
                {vehicles.map((vehicle, index) => {
                    const person = persons[index];

                    return (
                        <li className="vehicle-item" key={vehicle.id}>
                            <div className="vehicle-card-heading">
                                <div>
                                    <strong className="vehicle-card-title">
                                        {vehicle.Brand} {vehicle.Model}
                                    </strong>
                                    <span className="vehicle-card-plate">
                                        Placa: {vehicle.CarLisencePlate}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    aria-label={`Excluir veículo ${vehicle.CarLisencePlate}`}
                                    onClick={() => handleDelete(vehicle.CarLisencePlate)}
                                >
                                    Excluir
                                </button>
                            </div>

                            <div className="vehicle-card-details">
                                <div className="vehicle-card-detail">
                                    <span className="vehicle-detail-label">Tipo</span>
                                    <strong>{TypeVehicleLabel[vehicle.TypeVehicle] ?? "Não informado"}</strong>
                                </div>
                                <div className="vehicle-card-detail">
                                    <span className="vehicle-detail-label">Ano</span>
                                    <strong>{vehicle.ManufacturingYear}</strong>
                                </div>
                                <div className="vehicle-card-detail">
                                    <span className="vehicle-detail-label">Cor</span>
                                    <strong>{vehicle.Color}</strong>
                                </div>
                                <div className="vehicle-card-detail vehicle-driver-detail">
                                    <span className="vehicle-detail-label">Condutor</span>
                                    <strong>{person?.Name ?? "Não informado"}</strong>
                                    {person?.Phone && <span>Telefone: {person.Phone}</span>}
                                    {person?.CNH && <span>CNH: {person.CNH}</span>}
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
            <div className="justify-button">
                <button type="button" className="add-vehicle-btn" onClick={onAddVehicle}>
                    Adicionar Veículo
                </button>
            </div>

        </div>
    );
}

