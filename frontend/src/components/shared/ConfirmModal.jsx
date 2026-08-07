import './ConfirmModal.css';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
	if (!isOpen) return null;

	return (
		<div className="modal-overlay">
			<div className="modal-card">
				<h3>{title || 'Are you sure?'}</h3>
				<p>{message || 'This action cannot be undone.'}</p>

				<div className="modal-actions">
					<button className="btn-modal-cancel" onClick={onCancel}>
						Cancel
					</button>
					<button className="btn-modal-confirm" onClick={onConfirm}>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}
