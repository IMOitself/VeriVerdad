import { useState, useEffect } from 'react'
import { getStats, getUsers, getSections, getProfile } from '../api.js'
import './Statistics.css'
import Sidebar from '../components/dashboard/Sidebar'
import StatCard from '../components/dashboard/StatCard'
import CredibilityGauge from '../components/dashboard/CredibilityGauge'
import CraapBreakdown from '../components/dashboard/CraapBreakdown'
import BiasAnalysisCard from '../components/dashboard/BiasAnalysisCard'
import ClassroomAuditTable from '../components/dashboard/ClassroomAuditTable'
import SectionFilterBar from '../components/statistics/SectionFilterBar'
import AccessDenied from '../components/shared/AccessDenied'

const DEFAULT_STATS = {
	enrolled_students: 0,
	class_average: '0%',
	links_verified: 0,
	active_tasks: 0,
	craap_breakdown: [
		{ name: 'Currency', score: 0 },
		{ name: 'Relevance', score: 0 },
		{ name: 'Authority', score: 0 },
		{ name: 'Accuracy', score: 0 },
		{ name: 'Purpose', score: 0 },
	],
	bias_rate: 0,
	clickbait_rate: 0,
}

export default function Statistics() {
	const [sections, setSections] = useState([])
	const [selectedSectionId, setSelectedSectionId] = useState('')
	const [stats, setStats] = useState(DEFAULT_STATS)
	const [allStudents, setAllStudents] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState('')
	const [user, setUser] = useState(function () {
		try {
			return JSON.parse(localStorage.getItem('user'))
		} catch (e) {
			return null
		}
	})

	useEffect(function () {
		async function fetchInitialData() {
			setIsLoading(true)
			setError('')
			try {
				const profileRes = await getProfile()
				if (profileRes.success && profileRes.data) {
					setUser(profileRes.data)
					localStorage.setItem('user', JSON.stringify(profileRes.data))
				}
				const sectionsRes = await getSections()
				if (sectionsRes.success && sectionsRes.data) {
					setSections(sectionsRes.data)
				}
				const usersRes = await getUsers()
				if (usersRes.success && usersRes.data) {
					setAllStudents(usersRes.data.filter((u) => u.role === 'student'))
				}
				await fetchSectionStats('')
			} catch (err) {
				setError('Failed to load initial analytics data.')
			} finally {
				setIsLoading(false)
			}
		}
		fetchInitialData()
	}, [])

	async function fetchSectionStats(secId) {
		setIsLoading(true)
		setError('')
		try {
			const res = await getStats(secId || null)
			if (res.success && res.data) {
				setStats(res.data)
			} else if (res.message) {
				setError(res.message)
			}
		} catch (err) {
			setError('Could not retrieve statistics for the selected section.')
		} finally {
			setIsLoading(false)
		}
	}

	function handleSectionChange(e) {
		const newSecId = e.target.value
		setSelectedSectionId(newSecId)
		fetchSectionStats(newSecId)
	}

	const role = user?.role || 'student'

	if (role === 'student') {
		return (
			<div className="page-layout">
				<Sidebar />
				<div className="page-container">
					<AccessDenied
						title="Teacher & Administrator Analytics Portal"
						message="Classroom statistics and verification audits are restricted to teachers and administrators. You can view your personal assignments and badges on your dashboard."
					/>
				</div>
			</div>
		)
	}

	const availableSections =
		role === 'teacher'
			? sections.filter(
				(sec) =>
					sec.teacher_id === user?.id || sec.teacher?.id === user?.id,
			)
			: sections

	const displayedStudents = selectedSectionId
		? allStudents.filter(
			(s) => String(s.section_id || s.section?.id) === String(selectedSectionId),
		)
		: role === 'teacher'
			? allStudents.filter((s) => {
				const teacherSecIds = sections
					.filter((sec) => sec.teacher_id === user?.id || sec.teacher?.id === user?.id)
					.map((sec) => String(sec.id))
				if (teacherSecIds.length === 0) return true
				const studentSecId = String(s.section_id || s.section?.id || '')
				return teacherSecIds.includes(studentSecId)
			})
			: allStudents

	const averageScoreStr = String(stats.class_average || '0%')
	const averageScoreNum = parseInt(averageScoreStr.replace('%', '')) || 0

	return (
		<div className="page-layout">
			<Sidebar />
			<div className="page-container">
				<SectionFilterBar
					sections={availableSections}
					selectedSectionId={selectedSectionId}
					onChange={handleSectionChange}
					role={role}
				/>

				{error && (
					<div className="stats-error-banner">
						<span>{error}</span>
						<button
							className="btn-retry-stats"
							onClick={() => fetchSectionStats(selectedSectionId)}
						>
							Retry
						</button>
					</div>
				)}

				<div className={`stats-content-wrapper ${isLoading ? 'loading' : ''}`}>
					<div className="stats-overview">
						<StatCard
							label="Enrolled Students"
							value={String(stats.enrolled_students ?? displayedStudents.length)}
						/>
						<StatCard label="Class Average" value={stats.class_average || '0%'} />
						<StatCard
							label="Links Verified"
							value={String(stats.links_verified ?? 0)}
						/>
						<StatCard label="Active Tasks" value={String(stats.active_tasks ?? 0)} />
					</div>
					<div className="stats-grid-row">
						<CredibilityGauge score={averageScoreNum} label="Class Reliability Meter" />
						<CraapBreakdown metrics={stats.craap_breakdown} />
					</div>
					<BiasAnalysisCard
						biasRate={stats.bias_rate || 0}
						clickbaitRate={stats.clickbait_rate || 0}
					/>
					<ClassroomAuditTable students={displayedStudents} />
				</div>
			</div>
		</div>
	)
}