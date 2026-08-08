import { useState } from 'react'

export default function usePagination(items = [], itemsPerPage = 10) {
	const [page, setPage] = useState(1)
	const list = items || []
	const totalPages = Math.max(1, Math.ceil(list.length / itemsPerPage))
	const startIdx = (page - 1) * itemsPerPage
	const pageItems = list.slice(startIdx, startIdx + itemsPerPage)

	return { page, setPage, totalPages, pageItems }
}