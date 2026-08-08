import { Link } from 'react-router'
import './AccessDenied.css'

export default function AccessDenied({ title, message }) {
	return (
		<div className="access-denied-card">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 -960 960 960"
				className="access-denied-icon"
			>
				<path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z" />
			</svg>
			<h2>{title}</h2>
			<p>{message}</p>
			<Link to="/dashboard" className="btn-return-dashboard">
				Back to Dashboard
			</Link>
		</div>
	)
}