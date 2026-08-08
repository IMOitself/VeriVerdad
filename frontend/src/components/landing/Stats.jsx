import './Stats.css'

export default function Stats() {
	const stats = [
		{ value: '5', label: 'Verification Pillars' },
		{ value: '100%', label: 'Interactive AI Guidance' },
		{ value: 'Free', label: 'For Students & Teachers' }
	]

	return (
		<section className="landing-stats" id="stats">
			<div className="stats-container">
				{stats.map(function (stat, idx) {
					return (
						<div key={idx} className="stat-block">
							<span className="stat-value">{stat.value}</span>
							<span className="stat-label">{stat.label}</span>
						</div>
					)
				})}
			</div>
		</section>
	)
}