import './Modal.css'

export default function Modal({ size, children }) {
	return (
		<div className="modal-overlay">
			<div className={`modal-card ${size === 'md' ? 'modal-card-md' : ''}`}>
				{children}
			</div>
		</div>
	)
}