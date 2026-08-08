import { useState, useEffect } from 'react'
import {
	getUsers,
	register,
	updateUser,
	deleteUser,
	getSections,
	createSection,
	updateSection,
	deleteSection,
	logout,
} from '../api.js'
import useCurrentUser from '../hooks/useCurrentUser'
import usePagination from '../hooks/usePagination'
import './Admin.css'
import Sidebar from '../components/dashboard/Sidebar'
import ConfirmModal from '../components/shared/ConfirmModal'
import UserFormModal from '../components/admin/UserFormModal'
import SectionFormModal from '../components/classrooms/SectionFormModal'
import AdminTabs from '../components/admin/AdminTabs'
import UsersTable from '../components/admin/UsersTable'
import SectionsTable from '../components/admin/SectionsTable'

const ITEMS_PER_PAGE = 10

export default function Admin() {
	const [activeTab, setActiveTab] = useState('users')
	const [users, setUsers] = useState([])
	const [sections, setSections] = useState([])
	const [error, setError] = useState('')

	const [currentUser] = useCurrentUser()
	const [selectedUserId, setSelectedUserId] = useState(null)
	const [editingUser, setEditingUser] = useState(null)
	const [isAddUserOpen, setIsAddUserOpen] = useState(false)

	const [selectedSectionId, setSelectedSectionId] = useState(null)
	const [isAddSectionOpen, setIsAddSectionOpen] = useState(false)
	const [editingSection, setEditingSection] = useState(null)

	useEffect(function () {
		loadData()
	}, [])

	async function loadData() {
		setError('')
		const usersRes = await getUsers()
		if (usersRes.success && usersRes.data) {
			setUsers(usersRes.data)
		} else if (usersRes.error) {
			setError(usersRes.error)
		}

		const sectionsRes = await getSections()
		if (sectionsRes.success && sectionsRes.data) {
			setSections(sectionsRes.data)
		}
	}

	const teachers = users.filter(
		(u) => u.role === 'teacher' || u.role === 'admin'
	)

	const {
		page: userPage,
		setPage: setUserPage,
		totalPages: totalUserPages,
		pageItems: paginatedUsers
	} = usePagination(users, ITEMS_PER_PAGE)

	const {
		page: sectionPage,
		setPage: setSectionPage,
		totalPages: totalSectionPages,
		pageItems: paginatedSections
	} = usePagination(sections, ITEMS_PER_PAGE)

	async function handleConfirmDeleteUser() {
		if (!selectedUserId) return

		const targetId = selectedUserId
		setSelectedUserId(null)

		const result = await deleteUser(targetId)

		if (result.success) {
			if (currentUser && currentUser.id === targetId) {
				await logout()
				localStorage.removeItem('token')
				localStorage.removeItem('user')
				window.location.href = '/login'
			} else {
				setUsers(users.filter((user) => user.id !== targetId))
			}
		} else if (result.error) {
			setError(result.error)
		}
	}

	async function handleCreateUser(form) {
		const payload = {
			username: form.username,
			email: form.email,
			password: form.password,
			role: form.role,
			section_id:
				form.role === 'student' && form.section_id
					? parseInt(form.section_id)
					: null,
		}

		const result = await register(payload)

		if (result.success) {
			setIsAddUserOpen(false)
			await loadData()
		}
		return result
	}

	async function handleSaveUser(form) {
		if (!editingUser) return { success: false }

		const payload = {}
		if (form.username) payload.username = form.username
		if (form.email) payload.email = form.email
		if (form.role) payload.role = form.role
		payload.section_id =
			form.role === 'student' && form.section_id
				? parseInt(form.section_id)
				: null

		if (form.new_password) {
			payload.new_password = form.new_password
			payload.new_password_confirmation = form.new_password_confirmation
		}

		const result = await updateUser(editingUser.id, payload)

		if (result.success && result.data) {
			await loadData()
			if (currentUser && currentUser.id === editingUser.id) {
				localStorage.setItem('user', JSON.stringify(result.data))
				window.dispatchEvent(new Event('storage'))
			}
			setEditingUser(null)
		}
		return result
	}

	async function handleCreateSection(form) {
		const payload = {
			name: form.name,
			code: form.code,
			teacher_id: parseInt(form.teacher_id || teachers[0]?.id),
		}

		const result = await createSection(payload)

		if (result.success) {
			setIsAddSectionOpen(false)
			await loadData()
		}
		return result
	}

	async function handleSaveSection(form) {
		if (!editingSection) return { success: false }

		const payload = {
			name: form.name,
			code: form.code,
			teacher_id: parseInt(form.teacher_id),
		}

		const result = await updateSection(editingSection.id, payload)

		if (result.success) {
			await loadData()
			setEditingSection(null)
		}
		return result
	}

	async function handleConfirmDeleteSection() {
		if (!selectedSectionId) return

		const targetId = selectedSectionId
		setSelectedSectionId(null)

		const result = await deleteSection(targetId)

		if (result.success) {
			setSections(sections.filter((s) => s.id !== targetId))
			await loadData()
		} else {
			setError(result.message || 'Failed to delete section')
		}
	}

	return (
		<div className="page-layout">
			<Sidebar />
			<div className="page-container">
				<div className="admin-card">
					<div className="admin-header-row">
						<div>
							<h2>Admin Dashboard</h2>
							<p className="admin-subtitle">
								System User Management & Classroom Administration
							</p>
						</div>

						<div className="admin-header-actions">
							{activeTab === 'users' ? (
								<button
									className="btn-add-user"
									onClick={() => setIsAddUserOpen(true)}
								>
									Add User
								</button>
							) : (
								<button
									className="btn-add-user"
									onClick={() => setIsAddSectionOpen(true)}
								>
									Add Section
								</button>
							)}
						</div>
					</div>

					<AdminTabs
						activeTab={activeTab}
						onSelectTab={setActiveTab}
						userCount={users.length}
						sectionCount={sections.length}
					/>

					{error && <div className="error-general">{error}</div>}

					{activeTab === 'users' && (
						<UsersTable
							users={users}
							paginatedUsers={paginatedUsers}
							page={userPage}
							totalPages={totalUserPages}
							onPageChange={setUserPage}
							itemsPerPage={ITEMS_PER_PAGE}
							onEditUser={setEditingUser}
							onDeleteUser={setSelectedUserId}
						/>
					)}

					{activeTab === 'sections' && (
						<SectionsTable
							sections={sections}
							paginatedSections={paginatedSections}
							page={sectionPage}
							totalPages={totalSectionPages}
							onPageChange={setSectionPage}
							itemsPerPage={ITEMS_PER_PAGE}
							onEditSection={setEditingSection}
							onDeleteSection={setSelectedSectionId}
						/>
					)}

					{isAddUserOpen && (
						<UserFormModal
							mode="create"
							sections={sections}
							onSubmit={handleCreateUser}
							onClose={() => setIsAddUserOpen(false)}
						/>
					)}

					{editingUser && (
						<UserFormModal
							mode="edit"
							initialValues={{
								username: editingUser.username || '',
								email: editingUser.email || '',
								role: editingUser.role || 'student',
								section_id: editingUser.section_id || editingUser.section?.id || '',
								new_password: '',
								new_password_confirmation: ''
							}}
							sections={sections}
							onSubmit={handleSaveUser}
							onClose={() => setEditingUser(null)}
						/>
					)}

					{isAddSectionOpen && (
						<SectionFormModal
							mode="create"
							initialValues={{
								name: '',
								code: '',
								teacher_id: teachers[0]?.id || ''
							}}
							teachers={teachers}
							role="admin"
							onSubmit={handleCreateSection}
							onClose={() => setIsAddSectionOpen(false)}
						/>
					)}

					{editingSection && (
						<SectionFormModal
							mode="edit"
							initialValues={{
								name: editingSection.name || '',
								code: editingSection.code || '',
								teacher_id: editingSection.teacher_id || editingSection.teacher?.id || teachers[0]?.id || ''
							}}
							teachers={teachers}
							role="admin"
							onSubmit={handleSaveSection}
							onClose={() => setEditingSection(null)}
						/>
					)}

					<ConfirmModal
						isOpen={Boolean(selectedUserId)}
						title="Delete User Account"
						message="Are you sure you want to delete this user? This action cannot be undone."
						onConfirm={handleConfirmDeleteUser}
						onCancel={() => setSelectedUserId(null)}
					/>

					<ConfirmModal
						isOpen={Boolean(selectedSectionId)}
						title="Delete Classroom Section"
						message="Are you sure you want to delete this section? All enrolled students will be unassigned."
						onConfirm={handleConfirmDeleteSection}
						onCancel={() => setSelectedSectionId(null)}
					/>
				</div>
			</div>
		</div>
	)
}