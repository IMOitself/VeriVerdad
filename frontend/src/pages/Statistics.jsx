import './Statistics.css';
import Sidebar from '../components/dashboard/Sidebar';

export default function Statistics() {
	return (
		<div className="page-layout">
			<Sidebar />
			<div className="page-container">
				<div className="stats-overview">
					<div className="stat-box">
						<h3>Enrolled Students</h3>
						<p>42</p>
					</div>

					<div className="stat-box">
						<h3>Class Average</h3>
						<p>84%</p>
					</div>

					<div className="stat-box">
						<h3>Links Verified</h3>
						<p>158</p>
					</div>

					<div className="stat-box">
						<h3>Active Tasks</h3>
						<p>3</p>
					</div>
				</div>

				<div className="stats-detail-card">
					<h2>Class Performance Overview</h2>
					<p>Track student verification progress, section accuracy averages, and pending classroom assignments.</p>
				</div>
			</div>
		</div>
	);
}
