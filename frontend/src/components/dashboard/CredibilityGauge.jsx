import './CredibilityGauge.css'

export default function CredibilityGauge({
	score = 0,
	label = 'Class Reliability Meter'
}) {
	const numScore = Number(score)
	const clampedScore = isNaN(numScore)
		? 0
		: Math.max(0, Math.min(100, Math.round(numScore)))

	const angle = -90 + (clampedScore / 100) * 180

	function getStatusColor(val) {
		if (val === 0) return '#94A3B8'
		if (val >= 80) return '#10B981'
		if (val >= 60) return '#F59E0B'
		return '#EF4444'
	}

	function getStatusText(val) {
		if (val === 0) return 'NO VERIFICATION DATA YET'
		if (val >= 80) return 'HIGH CREDIBILITY'
		if (val >= 60) return 'CAUTION REQUIRED'
		return 'HIGH RISK OF MISINFORMATION'
	}

	return (
		<div className="gauge-card">
			<h3 className="gauge-label">{label}</h3>

			<div className="gauge-container">
				<svg viewBox="0 0 200 120" className="gauge-svg">
					<path
						d="M 20 100 A 80 80 0 0 1 180 100"
						fill="none"
						stroke="#E2E8F0"
						strokeWidth="16"
						strokeLinecap="round"
					/>
					<path
						d="M 20 100 A 80 80 0 0 1 180 100"
						fill="none"
						stroke={getStatusColor(clampedScore)}
						strokeWidth="16"
						strokeLinecap="round"
						strokeDasharray="251.2"
						strokeDashoffset={
							clampedScore === 0 ? 251.2 : 251.2 - 251.2 * (clampedScore / 100)
						}
					/>
					<g transform={`rotate(${angle} 100 100)`}>
						<line
							x1="100"
							y1="100"
							x2="100"
							y2="35"
							stroke="#1E293B"
							strokeWidth="4"
							strokeLinecap="round"
						/>
						<circle cx="100" cy="100" r="8" fill="#1E293B" />
					</g>
				</svg>

				<div className="gauge-value">{clampedScore}%</div>
				<span
					className="gauge-status-badge"
					style={{
						backgroundColor: `${getStatusColor(clampedScore)}15`,
						color: getStatusColor(clampedScore)
					}}
				>
					{getStatusText(clampedScore)}
				</span>
			</div>
		</div>
	)
}