import './History.css';
import Sidebar from '../components/dashboard/Sidebar';

const history = [
	{ id: 1, url: 'https://facebook.com/posts/viral-typhoon-news-claim', date: 'Aug 06, 2026', score: 92, bias: false },
	{ id: 2, url: 'https://news-update-2026.net/celebrity-endorsed-health-miracle', date: 'Aug 04, 2026', score: 35, bias: true },
	{ id: 3, url: 'https://social-blog.com/influencer-political-statement', date: 'Jul 29, 2026', score: 68, bias: false },
];

function scoreClass(score) {
	if (score >= 80) return 'high';
	if (score >= 60) return 'mid';
	return 'low';
}

export default function History() {
	return (
		<div className="page-layout">
			<Sidebar />
			<div className="page-container">
				<section className="history-table-card">
					<table className="history-table">
						<thead>
							<tr>
								<th>Target Claim / URL</th>
								<th>Date Verified</th>
								<th>Truth Score</th>
								<th>Idol Bias Status</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{history.map(function (item) {
								return (
									<tr key={item.id}>
										<td className="claim-cell">{item.url}</td>
										<td>{item.date}</td>
										<td><span className={`score-tag ${scoreClass(item.score)}`}>{item.score} / 100</span></td>
										<td><span className={`bias-tag ${item.bias ? 'flagged' : 'clean'}`}>{item.bias ? 'Idol Bias Flagged' : 'No Bias'}</span></td>
										<td><button className="btn-view">View Analysis</button></td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</section>
			</div>
		</div>
	);
}
