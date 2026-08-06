import './Sources.css';
import Sidebar from '../components/dashboard/Sidebar';
import BadgeCard from '../components/dashboard/BadgeCard';

const badges = [
	{ number: 1, name: 'Novice Sleuth', description: 'Completed first Socratic CRAAP verification quiz.', unlocked: true },
	{ number: 2, name: 'Speed Verifier', description: 'Verified a complex claim in under 3 minutes with 90%+ accuracy.', unlocked: true },
	{ number: 3, name: 'Lateral Reader', description: 'Cross-checked 5 external author domain credentials.', unlocked: false },
	{ number: 4, name: 'Unbiased Thinker', description: 'Deconstructed personal Idol Bias on 3 viral articles.', unlocked: false },
];

const guidelines = [
	{ tag: 'AUTHORITY', title: 'Cross-Check Author Credentials', body: 'Always verify if the publisher or content creator has established domain expertise and verifiable affiliations before trusting news reports.' },
	{ tag: 'CURRENCY', title: 'Check Publication Timestamp', body: 'Ensure old news reports or recycled media clips from past years are not being misrepresented as current live events.' },
	{ tag: 'PURPOSE', title: 'Identify Intended Bias & Engagement Bait', body: 'Distinguish between objective investigative journalism and emotionally driven clickbait designed to exploit parasocial attachment.' },
];

export default function Sources() {
	return (
		<div className="page-layout">
			<Sidebar />
			<div className="page-container">
				<section className="sources-section">
					<h2>Academic Badges</h2>
					<div className="badges-grid">
						{badges.map(function (badge) {
							return (
								<BadgeCard
									key={badge.number}
									number={badge.number}
									name={badge.name}
									description={badge.description}
									unlocked={badge.unlocked}
								/>
							);
						})}
					</div>
				</section>

				<section className="sources-section">
					<h2>Fact-Checking & Credibility Guidelines</h2>
					<div className="sources-list">
						{guidelines.map(function (item) {
							return (
								<div key={item.tag} className="source-item">
									<span className="source-tag">{item.tag}</span>
									<h4>{item.title}</h4>
									<p>{item.body}</p>
								</div>
							);
						})}
					</div>
				</section>
			</div>
		</div>
	);
}
