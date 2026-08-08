import './Pagination.css'

export default function Pagination({
	page,
	totalPages,
	onPageChange,
	totalItems = 0,
	itemsPerPage = 10,
	size = 'default',
	itemLabel = 'items'
}) {
	if (!totalPages || totalPages <= 1) return null

	if (size === 'compact') {
		return (
			<div className="pagination-compact">
				<button
					type="button"
					className="btn-pagination-sm"
					disabled={page <= 1}
					onClick={() => onPageChange(Math.max(1, page - 1))}
					title="Previous page"
				>
					Previous
				</button>
				<span className="pagination-info-sm">
					{page} / {totalPages}
				</span>
				<button
					type="button"
					className="btn-pagination-sm"
					disabled={page >= totalPages}
					onClick={() => onPageChange(Math.min(totalPages, page + 1))}
					title="Next page"
				>
					Next
				</button>
			</div>
		)
	}

	const startIdx = (page - 1) * itemsPerPage
	const endIdx = Math.min(startIdx + itemsPerPage, totalItems)

	return (
		<div className="pagination-default">
			<span className="pagination-summary">
				Showing {totalItems > 0 ? startIdx + 1 : 0}–{endIdx} of {totalItems} {itemLabel}
			</span>
			<div className="pagination-controls">
				<button
					type="button"
					className="btn-pagination"
					disabled={page <= 1}
					onClick={() => onPageChange(Math.max(1, page - 1))}
				>
					Previous
				</button>
				<span className="pagination-num">
					Page {page} of {totalPages}
				</span>
				<button
					type="button"
					className="btn-pagination"
					disabled={page >= totalPages}
					onClick={() => onPageChange(Math.min(totalPages, page + 1))}
				>
					Next
				</button>
			</div>
		</div>
	)
}