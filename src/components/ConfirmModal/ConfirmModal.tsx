import "./ConfirmModal.css";

type Props = {
    title: string;
    message: string;
    onConfirm: () => void;
    onClose: () => void;
};

export function ConfirmModal({ title, message, onConfirm, onClose }: Props) {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h3>{title}</h3>
                <p>{message}</p>

                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose}>Cancelar</button>
                    <button className="btn-confirm" onClick={onConfirm}>Confirmar</button>
                </div>
            </div>
        </div>
    );
}
