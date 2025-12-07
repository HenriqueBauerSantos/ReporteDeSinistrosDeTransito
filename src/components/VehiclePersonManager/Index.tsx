import { Vehicle } from "../../model/Vehicle";
import { Person } from "../../model/Person";
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
                {vehicles.map((v, i) => (
                    <li className="vehicle-item" key={i}>
                        <div>
                            <strong>{v.Brand} {v.Model}</strong> ({v.CarLisencePlate})
                            <br />
                            <span>Condutor: {persons[i]?.Name ?? "Não informado"}</span>
                        </div>
                        <button type="button" onClick={() => handleDelete(v.CarLisencePlate)}>Excluir</button>
                    </li>
                ))}
            </ul>
            <div className="justify-button">
                <button type="button" className="add-vehicle-btn" onClick={onAddVehicle}>
                    Adicionar Veículo
                </button>
            </div>

        </div>
    );
}

