import './Dashboard.css';
import Sidebar from '../components/dashboard/Sidebar';
import TaskCard from '../components/dashboard/TaskCard';
import BadgeCard from '../components/dashboard/BadgeCard';

const tasks = [
	{ id: 1, category: 'Social Media', title: 'Verify Viral Typhoon News Claim', due: 'Tomorrow at 5:00 PM' },
	{ id: 2, category: 'News Article', title: 'Check Author Authority on Health Post', due: 'Aug 10, 2026' },
];

const badges = [
	{ number: 1, name: 'Novice Sleuth', description: 'Completed first Socratic CRAAP verification quiz.', unlocked: true },
	{ number: 2, name: 'Speed Verifier', description: 'Verified a claim in under 3 minutes with 90%+ accuracy.', unlocked: true },
	{ number: 3, name: 'Lateral Reader', description: 'Cross-checked 5 external author domain credentials.', unlocked: false },
	{ number: 4, name: 'Unbiased Thinker', description: 'Deconstructed personal Idol Bias on 3 viral articles.', unlocked: false },
];

export default function Dashboard() {
	return (
		<div className="dashboard-page">
			<Sidebar />
			<div className="dashboard-container">
				<div className="hero-cards">
					<div className="hero-card hero-card1">
						<h1>Verify Before You Believe.</h1>
						<p>Analyze websites, news articles, and social media posts using AI-powered source verification designed to help Filipinos identify misinformation.</p>
						<div className="hero-card-buttons">
							<button className="btn-primary">Verify a link</button>
							<button className="btn-secondary">Learn More</button>
						</div>
					</div>
					<div className="hero-card hero-card2">
						<h3>MEDIA LITERACY TIP</h3>
						<p>"People often trust information because it comes from someone they admire. Verify the claim before believing or sharing it."</p>
						<div className="pfps">
							<img src="logo.png" className="pfp" alt="PFP" />
							<img src="logo.png" className="pfp" alt="PFP" />
							<img src="logo.png" className="pfp" alt="PFP" />
						</div>
					</div>
				</div>

				<div className="dashboard-grid">
					<div className="dashboard-col">
						<h2 className="col-title">Active Assignments</h2>
						<div className="task-list">
							{tasks.map(function (task) {
								return (
									<TaskCard
										key={task.id}
										category={task.category}
										title={task.title}
										due={task.due}
									/>
								);
							})}
						</div>
					</div>

					<div className="dashboard-col">
						<h2 className="col-title">Academic Badges</h2>
						<div className="badge-list">
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
					</div>
				</div>
			</div>
		</div>
	);
}