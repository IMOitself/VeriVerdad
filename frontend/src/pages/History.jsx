import './History.css';
import Sidebar from '../components/dashboard/Sidebar';

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
							<tr>
								<td className="claim-cell">https://facebook.com/posts/viral-typhoon-news-claim</td>
								<td>Aug 06, 2026</td>
								<td><span className="score-tag high">92 / 100</span></td>
								<td><span className="bias-tag clean">No Bias</span></td>
								<td><button className="btn-view">View Analysis</button></td>
							</tr>
							<tr>
								<td className="claim-cell">https://news-update-2026.net/celebrity-endorsed-health-miracle</td>
								<td>Aug 04, 2026</td>
								<td><span className="score-tag low">35 / 100</span></td>
								<td><span className="bias-tag flagged">Idol Bias Flagged</span></td>
								<td><button className="btn-view">View Analysis</button></td>
							</tr>
							<tr>
								<td className="claim-cell">https://social-blog.com/influencer-political-statement</td>
								<td>Jul 29, 2026</td>
								<td><span className="score-tag mid">68 / 100</span></td>
								<td><span className="bias-tag clean">No Bias</span></td>
								<td><button className="btn-view">View Analysis</button></td>
							</tr>
						</tbody>
					</table>
				</section>
			</div>
		</div>
	);
}
