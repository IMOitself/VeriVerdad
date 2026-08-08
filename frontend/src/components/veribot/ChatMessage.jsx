import SourceCard from './SourceCard'
import './ChatMessage.css'

export default function ChatMessage({ msg, activeQuiz, onStartQuiz }) {
	return (
		<div className={`chat-message ${msg.sender} animate-message`}>
			<div className="message-content">
				<p>{msg.text}</p>

				{msg.analysis?.sources && msg.analysis.sources.length > 0 && (
					<div className="veribot-sources-grid">
						{msg.analysis.sources.map((src, sIdx) => (
							<SourceCard key={sIdx} source={src} />
						))}
					</div>
				)}

				{msg.canStartQuiz && !activeQuiz && (
					<div className="start-quiz-cta">
						<button
							className="btn-start-quiz"
							onClick={() => onStartQuiz(msg.analysis)}
						>
							Start CRAAP Socratic Quiz
						</button>
					</div>
				)}
			</div>
		</div>
	)
}