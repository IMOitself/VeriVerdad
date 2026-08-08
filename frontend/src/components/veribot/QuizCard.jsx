import './QuizCard.css'

export default function QuizCard({
	activeQuiz,
	currentQuestionIndex,
	quizFinished,
	quizResult,
	submittingQuiz,
	onAnswerOption,
	onFinishQuiz
}) {
	if (!activeQuiz) return null

	const currentQuestion = activeQuiz.questions[currentQuestionIndex]
	const keys = ['A', 'B', 'C', 'D']

	return (
		<div className="interactive-quiz-container animate-message">
			{!quizFinished ? (
				<div className="inline-quiz-box">
					<div className="quiz-header-row">
						<span className="quiz-pillar-tag">
							PILLAR {currentQuestionIndex + 1} OF {activeQuiz.questions.length}:{' '}
							{currentQuestion?.pillar || 'AUTHORITY'}
						</span>
						<span className="quiz-step-count">
							{currentQuestionIndex + 1}/{activeQuiz.questions.length}
						</span>
					</div>

					<h3>{currentQuestion?.question}</h3>

					<div className="inline-options">
						{currentQuestion?.options.map((opt, idx) => (
							<button
								key={idx}
								className="inline-opt"
								onClick={() => onAnswerOption(currentQuestionIndex, idx)}
							>
								<span className="opt-key">{keys[idx]}</span>
								<span>{opt}</span>
							</button>
						))}
					</div>
				</div>
			) : (
				<div className="quiz-complete-card">
					<h3>Socratic Quiz Completed</h3>
					{quizResult ? (
						<p>
							Score: <strong>{quizResult.quiz_score}%</strong> (
							{quizResult.correct_count}/{quizResult.total} Correct). Saved to your
							analytics report.
						</p>
					) : submittingQuiz ? (
						<p>Recording quiz score to your account...</p>
					) : (
						<p>You evaluated all 5 CRAAP pillars for this claim.</p>
					)}
					<button className="btn-finish-quiz" onClick={onFinishQuiz}>
						Back to Chat
					</button>
				</div>
			)}
		</div>
	)
}
