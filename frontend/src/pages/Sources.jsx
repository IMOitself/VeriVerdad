import '../styles/PageLayout.css'
import './Sources.css'
import Sidebar from '../components/dashboard/Sidebar'
const guidelines = [
	{
		tag: 'AUTHORITY',
		title: 'Cross-Check Author Credentials',
		body: 'Always verify if the publisher or content creator has established domain expertise and verifiable affiliations before trusting news reports.',
	},
	{
		tag: 'CURRENCY',
		title: 'Check Publication Timestamp',
		body: 'Ensure old news reports or recycled media clips from past years are not being misrepresented as current live events.',
	},
	{
		tag: 'PURPOSE',
		title: 'Identify Intended Bias & Engagement Bait',
		body: 'Distinguish between objective investigative journalism and emotionally driven clickbait designed to exploit parasocial attachment.',
	},
]

export default function Sources() {
	return (
		<div className="page-layout">
			<Sidebar />
			<div className="page-container">
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
							)
						})}
					</div>
				</section>
			</div>
		</div>
	)
}