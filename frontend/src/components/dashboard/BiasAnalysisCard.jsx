import './BiasAnalysisCard.css'

export default function BiasAnalysisCard({
	biasRate = 22,
	clickbaitRate = 18
}) {
	return (
		<div className="bias-card">
			<h3>Cognitive & Idol Bias Index</h3>
			<p className="bias-subtitle">
				Measures parasocial attachment and emotional clickbait detection
			</p>

			<div className="bias-stats-row">
				<div className="bias-stat-box">
					<span className="bias-number">{biasRate}%</span>
					<span className="bias-label">Idol Bias Susceptibility</span>
				</div>
				<div className="bias-stat-box">
					<span className="bias-number">{clickbaitRate}%</span>
					<span className="bias-label">Clickbait Misleading Rate</span>
				</div>
			</div>
		</div>
	)
}