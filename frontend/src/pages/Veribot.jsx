import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Sidebar } from '../components/Sidebar'
import { UpArrowIcon, EditIcon, CopyIcon, Chevron } from '../components/Icons'
import { sendMessage, getConversation } from '../api'

const getTime = d => new Date(d || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export const Thinking = ({ reasoning, thinkTime, isThinkingActive = false }) => {
	const [isOpen, setIsOpen] = useState(true)
	return (
		<div className="my-2 select-none">
			<button type="button" onClick={() => setIsOpen(!isOpen)} className="group flex items-center gap-2 py-1.5 px-2.5 rounded-lg hover:opacity-80 text-[var(--color-text-muted)] text-xs cursor-pointer">
				<img src="/logo.png" alt="" className="h-4 w-auto object-contain" />
				<span className="font-medium">{isThinkingActive ? 'Thinking...' : `Thought for ${thinkTime || '2 seconds'}`}</span>
				<span className="opacity-0 group-hover:opacity-100">
					<Chevron open={isOpen} />
				</span>
			</button>
			{isOpen && (
				<div className="mt-2 pl-3.5 border-l-2 border-[var(--color-border)]">
					<div className="text-xs text-[var(--color-text-muted)] space-y-1.5 py-1 leading-relaxed">
						{reasoning ? <div className="whitespace-pre-wrap">{reasoning}</div> : <div className="text-[var(--color-text-faint)] italic">Analyzing user prompt, assessing intent, and preparing response steps...</div>}
					</div>
				</div>
			)}
		</div>
	)
}

export const Component = () => {
	const { conversationId: routeId } = useParams()
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const [messages, setMessages] = useState([])
	const [input, setInput] = useState('')
	const [editingId, setEditingId] = useState(null)
	const [editText, setEditText] = useState('')
	const [interactiveChoice, setInteractiveChoice] = useState(null)
	const [conversationId, setConversationId] = useState(routeId || null)
	const scrollContainerRef = useRef(null)
	const textareaRef = useRef(null)

	const scroll = () => setTimeout(() => scrollContainerRef.current?.scrollTo({ top: scrollContainerRef.current.scrollHeight }), 10)

	useEffect(() => {
		if (routeId) {
			if (routeId !== conversationId || !messages.length) {
				setConversationId(routeId)
				getConversation(routeId).then(res => setMessages((res?.messages || res?.data?.messages || (Array.isArray(res?.data) ? res.data : [])).map(m => ({ ...m, timestamp: getTime(m.created_at) }))))
			}
		} else (setConversationId(null), setMessages([]))
	}, [routeId])

	const chatMutation = useMutation({
		mutationFn: ({ message, id }) => sendMessage(message, id),
		onSuccess: res => {
			queryClient.invalidateQueries({ queryKey: ['chats'] })
			const targetId = res.data.conversation?.id || res.data.conversation_id
			targetId && (setConversationId(targetId), !routeId && navigate(`/veribot/${targetId}`, { replace: true }))
			setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: res.data.reply, reasoning: res.data.reasoning, timestamp: getTime(res.data.created_at) }])
			scroll()
		}
	})

	const sendPrompt = textToSend => {
		const text = textToSend || input.trim()
		if (!text || chatMutation.isPending) return
		chatMutation.reset()
		setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'user', content: text, timestamp: getTime() }])
		setInput('')
		textareaRef.current && (textareaRef.current.style.height = 'auto')
		scroll()
		chatMutation.mutate({ message: text, id: conversationId })
	}

	const saveEditing = id => editText.trim() && (setMessages(prev => prev.map(m => m.id === id ? { ...m, content: editText.trim() } : m)), setEditingId(null), setEditText(''))

	const renderInputCard = placeholderText => (
		<div className="w-full bg-[var(--color-surface)] rounded-2xl p-3.5 space-y-3 border border-[var(--color-border)]">
			<textarea ref={textareaRef} value={input} onChange={e => (setInput(e.target.value), textareaRef.current && (textareaRef.current.style.height = 'auto', textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`))} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendPrompt())} placeholder={placeholderText} rows={2} className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm p-1 pr-2 text-[var(--color-text)] placeholder-[var(--color-text-faint)] resize-none min-h-[44px] max-h-[200px]" />
			<div className="flex items-center justify-end">
				<button type="button" onClick={() => sendPrompt()} disabled={!input.trim() || chatMutation.isPending} className="p-1.5 bg-[var(--color-primary)] hover:opacity-80 text-white rounded-lg disabled:opacity-20 cursor-pointer">
					<UpArrowIcon className="w-4 h-4" />
				</button>
			</div>
		</div>
	)

	return (
		<div className="h-screen flex flex-col lg:flex-row bg-[var(--color-bg)] text-[var(--color-text)] overflow-hidden">
			<Sidebar />

			<main className="flex-1 flex flex-col h-full overflow-hidden relative">
				<header className="p-2.5 border-b border-[var(--color-border)] flex items-center justify-between shrink-0 bg-[var(--color-surface)] z-20">
					<button type="button" onClick={() => setInteractiveChoice({ title: 'Testing Mode: Pick a choice', options: ['Option A', 'Option B', 'Option C', 'Option D'] })} className="text-xs px-2.5 py-1 rounded-md bg-[var(--color-bg)] hover:opacity-80 text-[var(--color-text-muted)] border border-[var(--color-border)] cursor-pointer">
						Test Selection Choices
					</button>
				</header>

				<div ref={scrollContainerRef} className="flex-1 w-full overflow-y-auto">
					{!messages.length ? (
						<div className="flex flex-col items-center justify-center min-h-full p-4 md:p-8 max-w-3xl mx-auto w-full">
							<h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] tracking-tight mb-8 text-center">How can Veribot help you today?</h2>
							{renderInputCard("Ask Veribot to check a claim...")}
						</div>
					) : (
						<div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto w-full">
							{messages.map(msg => (
								<div key={msg.id} className="group flex flex-col space-y-1">
									<div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
										<div className={`max-w-[88%] rounded-lg px-4 py-2.5 text-sm text-[var(--color-text)] ${editingId === msg.id ? 'border border-[var(--color-border)]' : msg.role === 'user' ? 'bg-[var(--color-surface)]' : ''}`}>
											{msg.role === 'assistant' && msg.reasoning && <Thinking reasoning={msg.reasoning} thinkTime={msg.thinkTime} />}
											{editingId === msg.id ? (
												<textarea value={editText} onChange={e => setEditText(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.ctrlKey || e.metaKey) && saveEditing(msg.id)} rows={1} style={{ fieldSizing: 'content' }} className="w-full min-w-[280px] bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0 text-sm text-[var(--color-text)] resize-none" />
											) : (
												<p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
											)}
										</div>
										{editingId === msg.id && (
											<div className="flex justify-end gap-2 text-xs mt-1">
												<button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded text-[var(--color-text)] hover:opacity-80 cursor-pointer">Cancel</button>
												<button onClick={() => saveEditing(msg.id)} disabled={editText.trim() === msg.content} className="px-3 py-1.5 rounded bg-[var(--color-primary)] text-white font-medium hover:opacity-80 disabled:opacity-50 cursor-pointer">Save</button>
											</div>
										)}
										{editingId !== msg.id && (
											<div className="flex items-center gap-1 mt-1 px-1 text-[var(--color-text-faint)] opacity-0 group-hover:opacity-100">
												{msg.timestamp && <span className="text-xs pr-1.5">{msg.timestamp}</span>}
												{msg.role === 'user' && <button onClick={() => (setEditingId(msg.id), setEditText(msg.content))} className="p-1.5 rounded hover:opacity-80 flex items-center justify-center cursor-pointer" style={{ width: '28px', height: '28px' }}><EditIcon style={{ width: '1em', height: '1em', fontSize: '16px' }} /></button>}
												<button onClick={() => navigator.clipboard.writeText(msg.content)} className="p-1.5 rounded hover:opacity-80 flex items-center justify-center cursor-pointer" style={{ width: '28px', height: '28px' }}><CopyIcon style={{ width: '1em', height: '1em', fontSize: '16px' }} /></button>
											</div>
										)}
									</div>
								</div>
							))}

							{chatMutation.isPending && (
								<div className="flex flex-col items-start max-w-[88%]">
									<div className="p-3 rounded-xl w-full">
										<Thinking isThinkingActive={true} />
									</div>
								</div>
							)}
						</div>
					)}
				</div>

				<div className="p-4 shrink-0 bg-[var(--color-bg)] max-w-3xl w-full mx-auto space-y-3">
					{interactiveChoice && !chatMutation.isPending && (
						<div className="bg-[var(--color-surface)] rounded-xl p-3.5 space-y-2 border border-[var(--color-border)]">
							<div className="flex items-center justify-between px-0.5">
								<span className="text-xs font-semibold text-[var(--color-text)]">{interactiveChoice.title}</span>
								<button onClick={() => setInteractiveChoice(null)} className="text-[11px] text-[var(--color-text-faint)] hover:opacity-80 cursor-pointer">Dismiss</button>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
								{interactiveChoice.options.map((opt, idx) => (
									<button key={idx} onClick={() => (setInteractiveChoice(null), sendPrompt(`I choose ${opt}.`))} className="flex items-center gap-2.5 p-2 rounded-lg bg-[var(--color-bg)] hover:opacity-80 border border-[var(--color-border)] text-left text-xs text-[var(--color-text)] cursor-pointer">
										<span className="w-5 h-5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[11px] text-[var(--color-text-muted)] shrink-0">{idx + 1}</span>
										<span className="flex-1 font-medium">{opt}</span>
									</button>
								))}
							</div>
						</div>
					)}

					{chatMutation.error?.response?.data?.message && (
						<div className="text-center text-xs text-[var(--color-text-muted)] bg-[var(--color-border)] rounded-lg py-2 px-3">
							{chatMutation.error.response.data.message}
						</div>
					)}

					{!!messages.length && renderInputCard(interactiveChoice ? "Pick an option above or type here..." : "Reply to Veribot...")}

					<div className="text-center text-[11px] text-[var(--color-text-faint)]">
						<span>AI can make mistakes. Please double-check responses.</span>
					</div>
				</div>
			</main>
		</div>
	)
}