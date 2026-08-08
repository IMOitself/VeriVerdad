import { Link } from 'react-router'
import './CTA.css'

export default function CTA() {
	return (
		<section className="landing-cta" id="cta">
			<div className="cta-container">
				<h2 className="cta-title">Think twice before you hit share.</h2>
				<p className="cta-subtitle">
					Sharpen your digital detective skills and help stop the spread of
					viral misinformation.
				</p>
				<Link to="/login" className="btn-cta-primary">
					Try VeriVerdad
				</Link>
			</div>
		</section>
	)
}