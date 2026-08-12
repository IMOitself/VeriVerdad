import { useState, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Sidebar } from '../components/Sidebar'
import { UpArrowIcon, EditIcon, CopyIcon, Chevron } from '../components/Icons'
import { sendMessage } from '../api'

const Thinking = ({ reasoning, thinkTime, isThinkingActive = false }) => {
	const [isOpen, setIsOpen] = useState(true)
	return (
		<div className="my-2 select-none">
			<button type="button" onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 py-1.5 px-2.5 rounded-lg hover:opacity-80 text-[var(--color-text-muted)] text-xs cursor-pointer">
				<img src="/logo.png" alt="" className="h-4 w-auto object-contain" />
				<span className="font-medium">{isThinkingActive ? 'Thinking...' : `Thought for ${thinkTime || '2 seconds'}`}</span>
				<Chevron open={isOpen} />
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
	const [messages, setMessages] = useState([])
	const [input, setInput] = useState('')
	const [editingId, setEditingId] = useState(null)
	const [editText, setEditText] = useState('')
	const [interactiveChoice, setInteractiveChoice] = useState(null)
	const [conversationId, setConversationId] = useState(null)

	const scrollContainerRef = useRef(null)
	const textareaRef = useRef(null)

	const chatMutation = useMutation({
		mutationFn: ({ message, id }) => sendMessage(message, id),
		onSuccess: res => {
			if (res.data.conversation_id) setConversationId(res.data.conversation_id)
			setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: res.data.reply, reasoning: res.data.reasoning, timestamp: 'Just now' }])
			setTimeout(() => scrollToBottom(), 10)
		}
	})

	const isThinking = chatMutation.isPending
	const errorMessage = chatMutation.error?.response?.data?.message

	const scrollToBottom = () => scrollContainerRef.current?.scrollTo({ top: scrollContainerRef.current.scrollHeight, behavior: 'smooth' })

	const handleInputChange = e => {
		setInput(e.target.value)
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto'
			textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
		}
	}

	const handleOptionSelect = optionText => (setInteractiveChoice(null), sendPrompt(`I choose ${optionText}.`))

	const triggerTestChoicesCard = () => setInteractiveChoice({ title: 'Testing Mode: Pick a choice', options: ['Option A', 'Option B', 'Option C', 'Option D'] })

	const sendPrompt = textToSend => {
		const text = textToSend || input.trim()
		if (!text || isThinking) return

		chatMutation.reset()
		setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'user', content: text, timestamp: 'Just now' }])
		setInput('')
		if (textareaRef.current) textareaRef.current.style.height = 'auto'
		setTimeout(() => scrollToBottom(), 10)

		chatMutation.mutate({ message: text, id: conversationId })
	}

	const handleKeyDown = e => {
		if (e.key === 'Enter' && !e.shiftKey) (e.preventDefault(), sendPrompt())
	}

	const startEditing = msg => (setEditingId(msg.id), setEditText(msg.content))
	const saveEditing = id => {
		if (!editText.trim()) return
		setMessages(prev => prev.map(m => m.id === id ? { ...m, content: editText.trim() } : m))
		setEditingId(null)
		setEditText('')
	}

	const renderInputCard = placeholderText => (
		<div className="w-full bg-[var(--color-surface)] rounded-2xl p-3.5 space-y-3 border border-[var(--color-border)]">
			<textarea ref={textareaRef} value={input} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder={placeholderText} rows={2} className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm p-1 pr-2 text-[var(--color-text)] placeholder-[var(--color-text-faint)] resize-none min-h-[44px] max-h-[200px]" />
			<div className="flex items-center justify-end">
				<button type="button" onClick={() => sendPrompt()} disabled={!input.trim() || isThinking} className="p-1.5 bg-[var(--color-primary)] hover:opacity-80 text-white rounded-lg disabled:opacity-20">
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
					<button type="button" onClick={triggerTestChoicesCard} className="text-xs px-2.5 py-1 rounded-md bg-[var(--color-bg)] hover:opacity-80 text-[var(--color-text-muted)] border border-[var(--color-border)]">
						Test Selection Choices
					</button>
				</header>

				<div ref={scrollContainerRef} className="flex-1 w-full overflow-y-auto">
					{messages.length === 0 ? (
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
												<textarea value={editText} onChange={e => setEditText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) saveEditing(msg.id) }} rows={1} style={{ fieldSizing: 'content' }} className="w-full min-w-[280px] bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0 text-sm text-[var(--color-text)] resize-none" />
											) : (
												<p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
											)}
										</div>
										{editingId === msg.id && (
											<div className="flex justify-end gap-2 text-xs mt-1">
												<button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded text-[var(--color-text)] hover:bg-[var(--color-border)]">Cancel</button>
												<button onClick={() => saveEditing(msg.id)} disabled={editText.trim() === msg.content} className="px-3 py-1.5 rounded bg-[var(--color-primary)] text-white font-medium hover:opacity-80 disabled:opacity-50">Save</button>
											</div>
										)}
										{editingId !== msg.id && (
											<div className="flex items-center gap-1 mt-1 px-1 text-[var(--color-text-faint)] opacity-0 group-hover:opacity-100">
												{msg.timestamp && <span className="text-xs pr-1.5">{msg.timestamp}</span>}
												{msg.role === 'user' && <button onClick={() => startEditing(msg)} className="p-1.5 rounded hover:bg-[var(--color-border)] flex items-center justify-center cursor-pointer" style={{ width: '28px', height: '28px' }}><EditIcon style={{ width: '1em', height: '1em', fontSize: '16px' }} /></button>}
												<button onClick={() => navigator.clipboard.writeText(msg.content)} className="p-1.5 rounded hover:bg-[var(--color-border)] flex items-center justify-center cursor-pointer" style={{ width: '28px', height: '28px' }}><CopyIcon style={{ width: '1em', height: '1em', fontSize: '16px' }} /></button>
											</div>
										)}
									</div>
								</div>
							))}

							{isThinking && (
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
					{interactiveChoice && !isThinking && (
						<div className="bg-[var(--color-surface)] rounded-xl p-3.5 space-y-2 border border-[var(--color-border)]">
							<div className="flex items-center justify-between px-0.5">
								<span className="text-xs font-semibold text-[var(--color-text)]">{interactiveChoice.title}</span>
								<button onClick={() => setInteractiveChoice(null)} className="text-[11px] text-[var(--color-text-faint)] hover:opacity-80">Dismiss</button>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
								{interactiveChoice.options.map((opt, idx) => (
									<button key={idx} onClick={() => handleOptionSelect(opt)} className="flex items-center gap-2.5 p-2 rounded-lg bg-[var(--color-bg)] hover:opacity-80 border border-[var(--color-border)] text-left text-xs text-[var(--color-text)]">
										<span className="w-5 h-5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[11px] text-[var(--color-text-muted)] shrink-0">{idx + 1}</span>
										<span className="flex-1 font-medium">{opt}</span>
									</button>
								))}
							</div>
						</div>
					)}

					{errorMessage && (
						<div className="text-center text-xs text-[var(--color-text-muted)] bg-[var(--color-border)] rounded-lg py-2 px-3">
							{errorMessage}
						</div>
					)}

					{messages.length > 0 && renderInputCard(interactiveChoice ? "Pick an option above or type here..." : "Reply to Veribot...")}

					<div className="text-center text-[11px] text-[var(--color-text-faint)]">
						<span>AI can make mistakes. Please double-check responses.</span>
					</div>
				</div>
			</main>
		</div>
	)
}