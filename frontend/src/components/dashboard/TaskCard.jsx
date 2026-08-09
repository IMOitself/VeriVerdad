import { useNavigate } from 'react-router'
import './TaskCard.css'

export default function TaskCard({ task, category, title }) {
	const navigate = useNavigate()

	return (
		<div className="task-card">
			<div className="task-info">
				<span className="task-category">{category}</span>
				<h4>{title}</h4>
			</div>
			<button 
				className="btn-task-start"
				onClick={() => navigate('/veribot', { 
					state: { prefillUrl: task?.target_media_url, taskId: task?.id } 
				})}
			>
				Start Task
			</button>
		</div>
	)
}