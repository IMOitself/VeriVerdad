import './SourceCard.css'

export default function SourceCard({ source }) {
	let domain = ''
	try {
		domain = new URL(source.url).hostname.replace(/^www\./, '')
	} catch {
		domain = source.url
	}
	const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`

	return (
		<a
			href={source.url}
			target="_blank"
			rel="noopener noreferrer"
			className="source-card"
			title={source.title || source.url}
		>
			<div className="source-card-header">
				<img
					src={favicon}
					alt=""
					className="source-favicon"
					onError={(e) => {
						e.target.style.display = 'none'
					}}
				/>
				<span className="source-domain">{domain}</span>
			</div>
			<span className="source-title">{source.title || domain}</span>
		</a>
	)
}
