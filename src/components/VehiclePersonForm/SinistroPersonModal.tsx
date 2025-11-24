import { createPortal } from "react-dom";
import { VehicleForm } from "./Index";
import type { Vehicle } from "../../model/Vehicle";
import type { Person } from "../../model/Person";

export const VehiclePersonModal = ({ onSave, onCancel }: { onSave: (v: Vehicle, p: Person) => void, onCancel: () => void }) => {
    return createPortal(
        <div className="modal-overlay">
            <div className="modal-content">
                <VehicleForm onSave={onSave} onCancel={onCancel} />
            </div>
        </div>,
        document.body
    );
};
