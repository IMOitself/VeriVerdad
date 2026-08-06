import './StatCard.css';

export default function StatCard({ label, value }) {
	return (
		<div className="stat-box">
			<h3>{label}</h3>
			<p>{value}</p>
		</div>
	);
}
