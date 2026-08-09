import { Link } from 'react-router'
import { useState, useEffect } from 'react'
import {
	getTasks,
	getBadges,
	getProfile,
	getSections,
	createTask,
	updateTask,
	deleteTask
} from '../api.js'
import './Dashboard.css'
import Sidebar from '../components/dashboard/Sidebar'
import TaskCard from '../components/dashboard/TaskCard'
import BadgeCard from '../components/dashboard/BadgeCard'
import SectionStatusBanner from '../components/dashboard/SectionStatusBanner'
import TaskFormModal from '../components/dashboard/TaskFormModal'
import ConfirmModal from '../components/shared/ConfirmModal'

export default function Dashboard() {
	const [tasks, setTasks] = useState([])
	const [sections, setSections] = useState([])
	const [badges, setBadges] = useState([])
	const [userBadges, setUserBadges] = useState([])
	const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
	const [editingTask, setEditingTask] = useState(null)
	const [taskToDelete, setTaskToDelete] = useState(null)
	const [user, setUser] = useState(function () {
		const cachedUser = localStorage.getItem('user')
		if (cachedUser) {
			try {
				return JSON.parse(cachedUser)
			} catch (e) {
				return null
			}
		}
		return null
	})

	useEffect(function () {
		async function fetchDashboardData() {
			const taskRes = await getTasks()
			if (taskRes.success && taskRes.data) {
				setTasks(taskRes.data)
			}

			const secRes = await getSections()
			if (secRes.success && secRes.data) {
				setSections(secRes.data)
			}

			const badgeRes = await getBadges()
			if (badgeRes.success && badgeRes.data) {
				setBadges(badgeRes.data)
			}

			const profileRes = await getProfile()
			if (profileRes.success && profileRes.data) {
				setUser(profileRes.data)
				localStorage.setItem('user', JSON.stringify(profileRes.data))
				if (profileRes.data.badges) {
					setUserBadges(profileRes.data.badges.map((b) => b.id))
				}
			}
		}
		fetchDashboardData()
	}, [])

	const role = user?.role
	const assignedSection = user?.section
	const taughtSections = user?.taught_sections || user?.taughtSections || []

	async function handleCreateTask(form) {
		const payload = {
			title: form.title,
			target_media_url: form.target_media_url,
			section_id: parseInt(form.section_id),
			teacher_id: user.id
		}
		const res = await createTask(payload)
		if (res.success) {
			setIsAddTaskOpen(false)
			const taskRes = await getTasks()
			if (taskRes.success && taskRes.data) setTasks(taskRes.data)
		}
		return res
	}

	async function handleUpdateTask(form) {
		const payload = {
			title: form.title,
			target_media_url: form.target_media_url,
			section_id: parseInt(form.section_id)
		}

		const res = await updateTask(editingTask.id, payload)

		if (res.success) {
			setEditingTask(null)

			const taskRes = await getTasks()

			if (taskRes.success && taskRes.data) {
				setTasks(taskRes.data)
			}
		}

		return res
	}

	function handleDeleteTask(task) {
		setTaskToDelete(task)
	}

	async function handleConfirmDeleteTask() {
		if (!taskToDelete) return

		const id = taskToDelete.id

		setTaskToDelete(null)

		const res = await deleteTask(id)

		if (res.success) {
			const taskRes = await getTasks()

			if (taskRes.success && taskRes.data) {
				setTasks(taskRes.data)
			}
		} else {
			window.alert(res.message || res.error || 'Failed to delete task')
		}
	}

	return (
		<div className="dashboard-page">
			<Sidebar />
			<div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
				<SectionStatusBanner
					role={role}
					assignedSection={assignedSection}
					taughtSections={taughtSections}
				/>
				<div className="dashboard-container">
					<div className="hero-cards">
						<div className="hero-card hero-card1">
							<h1>Verify Before You Believe.</h1>
							<p>
								Analyze websites, news articles, and social media posts using
								AI-powered source verification designed to help Filipinos identify
								misinformation.
							</p>
							<div className="hero-card-buttons">
								<Link to="/veribot" className="btn-primary">
									Verify a link
								</Link>
								<Link to="/sources" className="btn-secondary">
									Learn More
								</Link>
							</div>
						</div>
						<div className="hero-card hero-card2">
							<h3>MEDIA LITERACY TIP</h3>
							<p>
								"People often trust information because it comes from someone they
								admire. Verify the claim before believing or sharing it."
							</p>
							<div className="pfps">
								<img src="/logo.png" className="pfp" alt="PFP" />
							</div>
						</div>
					</div>

					<div className="dashboard-grid">
						<div className="dashboard-col">
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								<h2 className="col-title">Active Assignments</h2>
								{(role === 'teacher' || role === 'admin') && (
									<button
										className="btn-primary"
										onClick={() => setIsAddTaskOpen(true)}
										style={{ marginBottom: '16px' }}
									>
										Create Task
									</button>
								)}
							</div>
							<div className="task-list">
								{tasks.length > 0 ? (
									tasks.map(function (task) {
										return (
											<TaskCard
												key={task.id}
												task={task}
												category={
													task.section ? task.section.name : 'General Task'
												}
												title={task.title}
												canManage={role === 'teacher' || role === 'admin'}
												onEdit={setEditingTask}
												onDelete={handleDeleteTask}
											/>
										)
									})
								) : (
									<p style={{ color: '#64748B', fontSize: '14px' }}>
										No active assignments found.
									</p>
								)}
							</div>
						</div>

						{role === 'student' && (
							<div className="dashboard-col">
								<h2 className="col-title">Academic Badges</h2>
								<div className="badge-list">
									{badges.length > 0 ? (
										badges.map(function (badge, index) {
											const isUnlocked = userBadges.includes(badge.id)
											return (
												<BadgeCard
													key={badge.id || index}
													number={index + 1}
													name={badge.name}
													description={badge.description}
													unlocked={isUnlocked}
												/>
											)
										})
									) : (
										<p style={{ color: '#64748B', fontSize: '14px' }}>
											No badges found.
										</p>
									)}
								</div>
							</div>
						)}
					</div>
				</div>

				{isAddTaskOpen && (
					<TaskFormModal
						mode="create"
						initialValues={{
							title: '',
							target_media_url: '',
							section_id: ''
						}}
						sections={sections}
						onSubmit={handleCreateTask}
						onClose={() => setIsAddTaskOpen(false)}
					/>
				)}

				{editingTask && (
					<TaskFormModal
						mode="edit"
						initialValues={{
							title: editingTask.title || '',
							target_media_url: editingTask.target_media_url || '',
							section_id: editingTask.section_id || ''
						}}
						sections={sections}
						onSubmit={handleUpdateTask}
						onClose={() => setEditingTask(null)}
					/>
				)}

				<ConfirmModal
					isOpen={taskToDelete !== null}
					title="Delete Task"
					message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
					onConfirm={handleConfirmDeleteTask}
					onCancel={() => setTaskToDelete(null)}
				/>
			</div>
		</div>
	)
}