import './Sources.css';
import Sidebar from '../components/dashboard/Sidebar';

export default function Sources() {
	return (
		<div className="page-layout">
			<Sidebar />
			<div className="page-container">
				<section className="sources-section">
					<h2>Academic Badges</h2>
					<div className="badges-grid">
						<div className="badge-card unlocked">
							<div className="badge-icon">01</div>
							<div className="badge-info">
								<h4>Novice Sleuth</h4>
								<p>Completed first Socratic CRAAP verification quiz.</p>
							</div>
							<span className="badge-status">Unlocked</span>
						</div>

						<div className="badge-card unlocked">
							<div className="badge-icon">02</div>
							<div className="badge-info">
								<h4>Speed Verifier</h4>
								<p>Verified a complex claim in under 3 minutes with 90%+ accuracy.</p>
							</div>
							<span className="badge-status">Unlocked</span>
						</div>

						<div className="badge-card locked">
							<div className="badge-icon">03</div>
							<div className="badge-info">
								<h4>Lateral Reader</h4>
								<p>Cross-checked 5 external author domain credentials.</p>
							</div>
							<span className="badge-status">Locked</span>
						</div>

						<div className="badge-card locked">
							<div className="badge-icon">04</div>
							<div className="badge-info">
								<h4>Unbiased Thinker</h4>
								<p>Deconstructed personal Idol Bias on 3 viral articles.</p>
							</div>
							<span className="badge-status">Locked</span>
						</div>
					</div>
				</section>

				<section className="sources-section">
					<h2>Fact-Checking & Credibility Guidelines</h2>
					<div className="sources-list">
						<div className="source-item">
							<span className="source-tag">AUTHORITY</span>
							<h4>Cross-Check Author Credentials</h4>
							<p>Always verify if the publisher or content creator has established domain expertise and verifiable affiliations before trusting news reports.</p>
						</div>

						<div className="source-item">
							<span className="source-tag">CURRENCY</span>
							<h4>Check Publication Timestamp</h4>
							<p>Ensure old news reports or recycled media clips from past years are not being misrepresented as current live events.</p>
						</div>

						<div className="source-item">
							<span className="source-tag">PURPOSE</span>
							<h4>Identify Intended Bias & Engagement Bait</h4>
							<p>Distinguish between objective investigative journalism and emotionally driven clickbait designed to exploit parasocial attachment.</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
