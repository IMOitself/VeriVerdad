import { Link } from 'react-router'
import './Hero.css'

export default function Hero() {
	return (
		<section className="landing-hero" id="hero">
			<div className="hero-container">
				<h1 className="hero-title">Can you tell fact from fiction online?</h1>
				<p className="hero-subtitle">
					People often trust information because it comes from someone they
					admire. VeriVerdad trains you to verify claims, question sources, and
					think critically before you share.
				</p>
				<div className="hero-actions">
					<Link to="/login" className="btn-hero-primary">
						Start Verifying
					</Link>
				</div>
			</div>
		</section>
	)
}