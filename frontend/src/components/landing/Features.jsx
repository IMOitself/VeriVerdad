import './Features.css'

export default function Features() {
	const featureList = [
		{
			title: 'question like a detective',
			description:
				"veribot doesn't spoon-feed you answers. it asks the right questions so you learn how to evaluate evidence on your own."
		},
		{
			title: 'break free from idol bias',
			description:
				'recognize when emotional loyalty to influencers, celebrities, or politicians blinds you to manipulated facts.'
		},
		{
			title: 'real-world practice',
			description:
				'analyze simulated viral posts, fabricated quotes, and misleading headlines in a safe classroom sandbox.'
		}
	]

	return (
		<section className="landing-features" id="features">
			<div className="features-container">
				<h2 className="features-title">
					built for the next generation of truth-seekers
				</h2>
				<div className="features-grid">
					{featureList.map(function (feature, idx) {
						return (
							<article key={idx} className="feature-card">
								<h3 className="feature-card-title">{feature.title}</h3>
								<p className="feature-card-desc">{feature.description}</p>
							</article>
						)
					})}
				</div>
			</div>
		</section>
	)
}