import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { getHistory, deleteVeribotSession } from '../api.js'
import './History.css'
import Sidebar from '../components/dashboard/Sidebar'

export default function History() {
	const [historyItems, setHistoryItems] = useState([])
	const [deletingId, setDeletingId] = useState(null)
	const navigate = useNavigate()

	useEffect(function () {
		async function fetchUserHistory() {
			const res = await getHistory()
			if (res.success && res.data) {
				setHistoryItems(res.data)
			}
		}
		fetchUserHistory()
	}, [])

	function handleOpenChat(item) {
		navigate('/veribot', { state: { session: item, fromHistory: true } })
	}

	async function handleDeleteChat(e, id) {
		e.stopPropagation()
		if (!window.confirm('Are you sure you want to delete this chat session?')) {
			return
		}

		setDeletingId(id)
		const res = await deleteVeribotSession(id)
		setDeletingId(null)

		if (res.success) {
			setHistoryItems((prev) => prev.filter((item) => item.id !== id))
		} else {
			alert(res.message || 'Failed to delete chat session.')
		}
	}

	return (
		<div className="page-layout">
			<Sidebar />
			<div className="page-container history-page-container">
				<div className="history-wrapper">
					<div className="history-header">
						<h2>Saved Verification Chats</h2>
						<p className="history-subtitle">
							Resume, review, or delete your past Socratic verification sessions
						</p>
					</div>

					<div className="history-stack-list">
						{historyItems.length > 0 ? (
							historyItems.map(function (item) {
								const dateStr = item.created_at
									? new Date(item.created_at).toLocaleDateString(undefined, {
										month: 'short',
										day: 'numeric',
										year: 'numeric',
									})
									: 'Recent'

								return (
									<div
										key={item.id}
										className="history-stack-item"
										onClick={() => handleOpenChat(item)}
									>
										<div className="stack-left-content">
											<h3 className="stack-item-title">
												{item.title || item.input_query}
											</h3>
											<p className="stack-item-query">{item.input_query}</p>
										</div>

										<div className="stack-right-meta">
											<span className="stack-item-date">{dateStr}</span>
											<span
												className={`bias-status ${item.bias_detected ? 'flagged' : 'clean'}`}
											>
												{item.bias_detected
													? 'Idol Bias Flagged'
													: 'No Bias Detected'}
											</span>

											<div className="stack-actions">
												<button
													className="btn-resume"
													onClick={(e) => {
														e.stopPropagation()
														handleOpenChat(item)
													}}
												>
													Open
												</button>
												<button
													className="btn-delete-card"
													onClick={(e) => handleDeleteChat(e, item.id)}
													disabled={deletingId === item.id}
												>
													Delete
												</button>
											</div>
										</div>
									</div>
								)
							})
						) : (
							<div className="empty-history-box">
								<p>
									No saved verification sessions yet. Start a new verification
									in VeriBot AI!
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}