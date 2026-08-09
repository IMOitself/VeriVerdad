import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import {
	analyzeVeribot,
	submitVeribotQuiz,
	deleteVeribotSession,
} from '../api.js'
import '../styles/PageLayout.css'
import './Veribot.css'
import Sidebar from '../components/dashboard/Sidebar'
import VeribotTopBar from '../components/veribot/VeribotTopBar'
import ChatMessage from '../components/veribot/ChatMessage'
import QuizCard from '../components/veribot/QuizCard'
import ConfirmModal from '../components/shared/ConfirmModal'

const STORAGE_KEY = 'veribot_active_session'

function getStoredSession() {
	try {
		const raw = sessionStorage.getItem(STORAGE_KEY)
		return raw ? JSON.parse(raw) : null
	} catch (e) {
		return null
	}
}

export default function Veribot() {
	const location = useLocation()
	const navigate = useNavigate()

	const initialSaved = getStoredSession()

	const [messages, setMessages] = useState(function () {
		if (location.state?.session) {
			const sess = location.state.session
			const savedMessages = sess.details?.messages
			if (Array.isArray(savedMessages) && savedMessages.length > 0) {
				return savedMessages
			}
			return [
				{ id: 1, sender: 'user', text: sess.input_query },
				{
					id: 2,
					sender: 'bot',
					text:
						sess.details?.summary ||
						'Verification completed across the CRAAP framework.',
					analysis: sess.details,
					canStartQuiz: Boolean(
						sess.details?.questions && sess.details.questions.length > 0,
					),
				},
			]
		}
		return initialSaved?.messages || []
	})

	const [inputQuery, setInputQuery] = useState(location.state?.prefillUrl || '')
	const [taskId, setTaskId] = useState(location.state?.taskId || null)
	const [loading, setLoading] = useState(false)
	const [currentSessionId, setCurrentSessionId] = useState(function () {
		if (location.state?.session) {
			return location.state.session.id
		}
		return initialSaved?.currentSessionId || null
	})

	const [isFromHistory, setIsFromHistory] = useState(function () {
		if (location.state?.session) return true
		return Boolean(initialSaved?.isFromHistory)
	})

	const [activeQuiz, setActiveQuiz] = useState(
		() => initialSaved?.activeQuiz || null,
	)
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
		() => initialSaved?.currentQuestionIndex || 0,
	)
	const [quizAnswers, setQuizAnswers] = useState(
		() => initialSaved?.quizAnswers || {},
	)
	const [quizFinished, setQuizFinished] = useState(
		() => initialSaved?.quizFinished || false,
	)
	const [quizResult, setQuizResult] = useState(
		() => initialSaved?.quizResult || null,
	)
	const [submittingQuiz, setSubmittingQuiz] = useState(false)
	const [chatToDelete, setChatToDelete] = useState(false)

	const messagesEndRef = useRef(null)

	useEffect(
		function () {
			if (location.state && location.state.session) {
				const sess = location.state.session
				setActiveQuiz(null)
				setCurrentSessionId(sess.id)
				setIsFromHistory(true)

				const savedMessages = sess.details?.messages
				if (Array.isArray(savedMessages) && savedMessages.length > 0) {
					setMessages(savedMessages)
				} else {
					setMessages([
						{
							id: 1,
							sender: 'user',
							text: sess.input_query,
						},
						{
							id: 2,
							sender: 'bot',
							text:
								sess.details?.summary ||
								'Verification completed across the CRAAP framework.',
							analysis: sess.details,
							canStartQuiz: Boolean(
								sess.details?.questions && sess.details.questions.length > 0,
							),
						},
					])
				}
			}
		},
		[location.state],
	)

	useEffect(
		function () {
			if (messages.length > 0) {
				try {
					sessionStorage.setItem(
						STORAGE_KEY,
						JSON.stringify({
							messages,
							currentSessionId,
							isFromHistory,
							activeQuiz,
							currentQuestionIndex,
							quizAnswers,
							quizFinished,
							quizResult,
						}),
					)
				} catch (e) {
				}
			} else {
				sessionStorage.removeItem(STORAGE_KEY)
			}
		},
		[
			messages,
			currentSessionId,
			isFromHistory,
			activeQuiz,
			currentQuestionIndex,
			quizAnswers,
			quizFinished,
			quizResult,
		],
	)

	useEffect(
		function () {
			messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
		},
		[messages, loading, activeQuiz, currentQuestionIndex],
	)

	function handleNewChat() {
		sessionStorage.removeItem(STORAGE_KEY)
		setMessages([])
		setInputQuery('')
		setCurrentSessionId(null)
		setIsFromHistory(false)
		setActiveQuiz(null)
		setCurrentQuestionIndex(0)
		setQuizAnswers({})
		setQuizFinished(false)
		setQuizResult(null)
		if (location.state?.session) {
			navigate(location.pathname, { replace: true, state: {} })
		}
	}

	function handleDeleteCurrentChat() {
		if (!currentSessionId) return
		setChatToDelete(true)
	}

	async function performDelete() {
		setChatToDelete(false)
		const res = await deleteVeribotSession(currentSessionId)
		if (res.success) {
			handleNewChat()
		} else {
			alert(res.message || 'Failed to delete chat session.')
		}
	}

	async function handleSend(e) {
		e?.preventDefault()
		if (!inputQuery.trim() || loading) return

		const userText = inputQuery.trim()
		setInputQuery('')
		setActiveQuiz(null)

		const updatedMessages = [
			...messages,
			{ id: Date.now(), sender: 'user', text: userText },
		]

		setMessages(updatedMessages)
		setLoading(true)

		const historyPayload = messages.map((m) => ({
			sender: m.sender,
			text: m.text,
		}))

		const res = await analyzeVeribot(userText, historyPayload, currentSessionId, taskId)
		setLoading(false)

		if (res.success && res.analysis) {
			if (res.veribot_id) {
				setCurrentSessionId(res.veribot_id)
			}
			const analysis = res.analysis
			const hasQuestions =
				Array.isArray(analysis.questions) && analysis.questions.length > 0

			setMessages((prev) => [
				...prev,
				{
					id: Date.now() + 1,
					sender: 'bot',
					text: analysis.summary || 'I have evaluated your query.',
					analysis: analysis,
					canStartQuiz: hasQuestions,
				},
			])
		} else {
			setMessages((prev) => [
				...prev,
				{
					id: Date.now() + 1,
					sender: 'bot',
					text:
						res.message ||
						'VeriBot is currently busy. Please try again in a moment.',
				},
			])
		}
	}

	function startQuiz(analysis) {
		setActiveQuiz(analysis)
		setCurrentQuestionIndex(0)
		setQuizAnswers({})
		setQuizFinished(false)
		setQuizResult(null)
	}

	async function handleAnswerOption(qIdx, optionIdx) {
		const newAnswers = { ...quizAnswers, [qIdx]: optionIdx }
		setQuizAnswers(newAnswers)

		if (currentQuestionIndex < activeQuiz.questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1)
		} else {
			setQuizFinished(true)

			if (currentSessionId) {
				setSubmittingQuiz(true)
				const subRes = await submitVeribotQuiz(currentSessionId, newAnswers)
				setSubmittingQuiz(false)
				if (subRes.success) {
					setQuizResult(subRes)
				}
			}
		}
	}

	const hasMessages = messages.length > 0

	return (
		<div className="page-layout">
			<Sidebar />

			<div className="veribot-chat-page">
				<VeribotTopBar
					hasMessages={hasMessages}
					isFromHistory={isFromHistory}
					currentSessionId={currentSessionId}
					onNewChat={handleNewChat}
					onDeleteChat={handleDeleteCurrentChat}
				/>

				<div className={`veribot-container ${!hasMessages ? 'centered-mode' : ''}`}>
					{!hasMessages ? (
						<div className="empty-welcome-hero">
							<img
								src="/mascot.png"
								alt="VeriBot Mascot"
								className="hero-veribot-logo"
							/>

							<form
								className="chat-input-bar hero-input-bar"
								onSubmit={handleSend}
							>
								<input
									type="text"
									placeholder="Message VeriBot or paste a link to verify..."
									value={inputQuery}
									onChange={(e) => setInputQuery(e.target.value)}
									disabled={loading}
									autoFocus
								/>
								<button
									type="submit"
									className="btn-chat-send"
									disabled={loading || !inputQuery.trim()}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										height="20px"
										viewBox="0 -960 960 960"
										width="20px"
										fill="currentColor"
									>
										<path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
									</svg>
								</button>
							</form>
						</div>
					) : (
						<>
							<div className="chat-messages-area">
								{messages.map((msg) => (
									<ChatMessage
										key={msg.id}
										msg={msg}
										activeQuiz={activeQuiz}
										onStartQuiz={startQuiz}
									/>
								))}

								<QuizCard
									activeQuiz={activeQuiz}
									currentQuestionIndex={currentQuestionIndex}
									quizFinished={quizFinished}
									quizResult={quizResult}
									submittingQuiz={submittingQuiz}
									onAnswerOption={handleAnswerOption}
									onFinishQuiz={() => setActiveQuiz(null)}
								/>

								{loading && (
									<div className="chat-message bot animate-message">
										<div className="message-content">
											<span>VeriBot is evaluating evidence...</span>
										</div>
									</div>
								)}
								<div ref={messagesEndRef} />
							</div>

							<form
								className="chat-input-bar bottom-input-bar"
								onSubmit={handleSend}
							>
								<input
									type="text"
									placeholder="Message VeriBot or paste a link to verify..."
									value={inputQuery}
									onChange={(e) => setInputQuery(e.target.value)}
									disabled={loading}
								/>
								<button
									type="submit"
									className="btn-chat-send"
									disabled={loading || !inputQuery.trim()}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										height="20px"
										viewBox="0 -960 960 960"
										width="20px"
										fill="currentColor"
									>
										<path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
									</svg>
								</button>
							</form>
						</>
					)}
				</div>
			</div>
			
			<ConfirmModal
				isOpen={chatToDelete}
				title="Delete Chat Session"
				message="Are you sure you want to delete this chat session? This action cannot be undone."
				onConfirm={performDelete}
				onCancel={() => setChatToDelete(false)}
			/>
		</div>
	)
}