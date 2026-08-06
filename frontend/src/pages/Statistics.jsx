import './Statistics.css';
import Sidebar from '../components/dashboard/Sidebar';
import StatCard from '../components/dashboard/StatCard';

export default function Statistics() {
	return (
		<div className="page-layout">
			<Sidebar />
			<div className="page-container">
				<div className="stats-overview">
					<StatCard label="Enrolled Students" value="42" />
					<StatCard label="Class Average" value="84%" />
					<StatCard label="Links Verified" value="158" />
					<StatCard label="Active Tasks" value="3" />
				</div>

				<div className="stats-detail-card">
					<h2>Class Performance Overview</h2>
					<p>Track student verification progress, section accuracy averages, and pending classroom assignments.</p>
				</div>
			</div>
		</div>
	);
}
