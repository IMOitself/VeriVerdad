import './BadgeCard.css';

export default function BadgeCard({ number, name, description, unlocked }) {
	return (
		<div className={`badge-card ${unlocked ? 'unlocked' : 'locked'}`}>
			<div className="badge-icon">{String(number).padStart(2, '0')}</div>
			<div className="badge-info">
				<h4>{name}</h4>
				<p>{description}</p>
			</div>
			<span className="badge-status">{unlocked ? 'Unlocked' : 'Locked'}</span>
		</div>
	);
}
