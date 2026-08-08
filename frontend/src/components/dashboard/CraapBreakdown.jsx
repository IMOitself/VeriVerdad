import './CraapBreakdown.css'

function normalizeCraapMetrics(raw) {
	const defaultPillars = [
		{ name: 'Currency', score: 0 },
		{ name: 'Relevance', score: 0 },
		{ name: 'Authority', score: 0 },
		{ name: 'Accuracy', score: 0 },
		{ name: 'Purpose', score: 0 }
	]

	if (!raw) return defaultPillars

	if (Array.isArray(raw)) {
		if (raw.length === 0) return defaultPillars
		return raw.map((item) => {
			if (typeof item === 'object' && item !== null) {
				const name = item.name || item.pillar || item.label || 'Unknown'
				const score = Number(item.score ?? item.value ?? 0)
				return {
					name: String(name).charAt(0).toUpperCase() + String(name).slice(1),
					score: isNaN(score)
						? 0
						: Math.max(0, Math.min(100, Math.round(score)))
				}
			}
			return { name: 'Criterion', score: 0 }
		})
	}

	if (typeof raw === 'object' && raw !== null) {
		const keys = Object.keys(raw)
		if (keys.length === 0) return defaultPillars
		return keys.map((key) => {
			const val = raw[key]
			const score =
				typeof val === 'object' && val !== null
					? Number(val.score ?? val.value ?? 0)
					: Number(val ?? 0)
			return {
				name: key.charAt(0).toUpperCase() + key.slice(1),
				score: isNaN(score) ? 0 : Math.max(0, Math.min(100, Math.round(score)))
			}
		})
	}

	return defaultPillars
}

export default function CraapBreakdown({ metrics }) {
	const items = normalizeCraapMetrics(metrics)

	return (
		<div className="craap-card">
			<h3>CRAAP Framework Skill Breakdown</h3>
			<p className="craap-subtitle">
				Classroom proficiency percentage across the 5 evaluation criteria
			</p>

			<div className="craap-bars">
				{items.map(function (item) {
					return (
						<div key={item.name} className="craap-bar-group">
							<div className="craap-bar-header">
								<span className="craap-bar-name">{item.name}</span>
								<span className="craap-bar-score">{item.score}%</span>
							</div>
							<div className="craap-bar-track">
								<div
									className="craap-bar-fill"
									style={{ width: `${item.score}%` }}
								/>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}