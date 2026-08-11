import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router'
import { MessageScroller, MessageScrollerProvider, MessageScrollerViewport, MessageScrollerContent, MessageScrollerItem, MessageScrollerButton } from '@/components/ui/message-scroller'
import { Message, MessageContent } from '@/components/ui/message'
import { Reasoning, ReasoningTrigger, ReasoningContent } from '@/components/ui/reasoning'
import { PromptInput, PromptInputBody, PromptInputTextarea, PromptInputFooter, PromptInputSubmit } from '@/components/ui/prompt-input'
import { api } from '@/services/api'

export default function Veribot() {
	const { conversationId } = useParams()
	const [messages, setMessages] = useState([])
	const [status, setStatus] = useState('ready')
	const conversationIdRef = useRef(conversationId || null)
	const textareaRef = useRef(null)

	useEffect(() => {
		if (conversationId) {
			api.get(`/api/chats/${conversationId}`).then(({ data }) => {
				setMessages(data.messages.map((msg) => ({
					id: msg.id,
					role: msg.role,
					content: msg.content,
					reasoning: msg.reasoning,
				})))
			})
		}
	}, [conversationId])

	const handleSubmit = async (e) => {
		e.preventDefault()
		const text = new FormData(e.currentTarget).get('message')?.trim() || ''
		if (!text || status === 'submitted') return

		setMessages((prev) => [...prev, {
			id: crypto.randomUUID(),
			role: 'user',
			content: text,
		}])
		setStatus('submitted')
		e.currentTarget.reset()

		try {
			const { data } = await api.post('/api/chat', {
				...(conversationIdRef.current && { conversation_id: conversationIdRef.current }),
				message: text,
			})

			if (data.conversation_id && !conversationIdRef.current) {
				conversationIdRef.current = data.conversation_id
			}

			setMessages((prev) => [...prev, {
				id: crypto.randomUUID(),
				role: 'assistant',
				content: data.reply,
				reasoning: data.reasoning,
			}])
		} finally {
			setStatus('ready')
			textareaRef.current?.focus()
		}
	}

	const renderMessage = (message) => (
		<MessageScrollerItem key={message.id}>
			<Message align={message.role === 'user' ? 'end' : 'start'}>
				<MessageContent>
					{message.role === 'assistant' && message.reasoning && (
						<Reasoning>
							<ReasoningTrigger />
							<ReasoningContent>{message.reasoning}</ReasoningContent>
						</Reasoning>
					)}
					<span>{message.content}</span>
				</MessageContent>
			</Message>
		</MessageScrollerItem>
	)

	return (
		<div className="flex h-screen flex-col">
			<MessageScrollerProvider>
				<MessageScroller className="flex-1 min-h-0">
					<MessageScrollerViewport>
						<MessageScrollerContent>
							{messages.map(renderMessage)}
						</MessageScrollerContent>
					</MessageScrollerViewport>
					<MessageScrollerButton direction="end" />
				</MessageScroller>
			</MessageScrollerProvider>

			<div className="p-4">
				<PromptInput onSubmit={handleSubmit}>
					<PromptInputBody>
						<PromptInputTextarea ref={textareaRef} placeholder="Ask VeriVerdad..." />
						<PromptInputFooter>
							<PromptInputSubmit status={status === 'submitted' ? 'submitted' : 'ready'} />
						</PromptInputFooter>
					</PromptInputBody>
				</PromptInput>
			</div>
		</div>
	)
}
