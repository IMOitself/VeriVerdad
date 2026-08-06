import './TaskCard.css';

export default function TaskCard({ category, title, due }) {
	return (
		<div className="task-card">
			<div className="task-info">
				<span className="task-category">{category}</span>
				<h4>{title}</h4>
				<p>Due: {due}</p>
			</div>
			<button className="btn-task-start">Start Task</button>
		</div>
	);
}
