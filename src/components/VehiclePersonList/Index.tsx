import { Trash2} from "lucide-react";
import type { Vehicle } from "../../model/Vehicle";
import './Index.css'

type VehicleListProps = {
    vehicles: Vehicle[];
    OnDeleteVehicleClick: (VehiclePlate: string) => void;
};

export function VehicleList({ vehicles, OnDeleteVehicleClick }: VehicleListProps) {

    return (
        <div className="vehicles-list">
            <h3>Veículos vinculados</h3>
            <ul>
                {vehicles.length === 0 && <li>Nenhum veículo adicionado.</li>}
                {vehicles.map((v, idx) => (
                    <li className="vehicle-item" key={idx}>
                        <span>{v.Brand} - {v.Model} ({v.CarLisencePlate})</span>
                        <button
                            type="button"
                            onClick={() => OnDeleteVehicleClick(v.CarLisencePlate)}
                        >
                            <Trash2 />
                        </button>
                    </li>
                ))}

            </ul>

        </div>
    );
}