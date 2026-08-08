import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import {
	getSections,
	createSection,
	updateSection,
	deleteSection,
	getUsers,
	updateUser,
	getProfile,
} from '../api.js'
import useCurrentUser from '../hooks/useCurrentUser'
import '../styles/PageLayout.css'
import './Classrooms.css'
import Sidebar from '../components/dashboard/Sidebar'
import ConfirmModal from '../components/shared/ConfirmModal'
import ClassroomSelector from '../components/classrooms/ClassroomSelector'
import RosterTable from '../components/classrooms/RosterTable'
import EnrollStudentModal from '../components/classrooms/EnrollStudentModal'
import SectionFormModal from '../components/classrooms/SectionFormModal'

export default function Classrooms() {
	const [user, setUser] = useCurrentUser()
	const [sections, setSections] = useState([])
	const [allUsers, setAllUsers] = useState([])
	const [selectedSectionId, setSelectedSectionId] = useState(null)
	const [error, setError] = useState('')
	const [successMsg, setSuccessMsg] = useState('')
	const [copyCodeSuccess, setCopyCodeSuccess] = useState(false)

	const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false)
	const [studentToRemove, setStudentToRemove] = useState(null)
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [editingSection, setEditingSection] = useState(null)
	const [sectionToDelete, setSectionToDelete] = useState(null)

	useEffect(function () {
		loadInitialData()
	}, [])

	async function loadInitialData() {
		setError('')
		const profileRes = await getProfile()
		let currentUser = user
		if (profileRes.success && profileRes.data) {
			currentUser = profileRes.data
			setUser(profileRes.data)
			localStorage.setItem('user', JSON.stringify(profileRes.data))
		}
		await refreshData(currentUser)
	}

	async function refreshData(currentUser = user) {
		const [sectionsRes, usersRes] = await Promise.all([getSections(), getUsers()])
		if (sectionsRes.success && sectionsRes.data) {
			setSections(sectionsRes.data)
			if (sectionsRes.data.length > 0) {
				setSelectedSectionId((prev) => {
					if (prev && sectionsRes.data.some((s) => s.id === prev)) {
						return prev
					}
					if (currentUser && currentUser.role === 'teacher') {
						const mySec = sectionsRes.data.find(
							(s) => s.teacher_id === currentUser.id || s.teacher?.id === currentUser.id,
						)
						if (mySec) return mySec.id
					}
					return sectionsRes.data[0].id
				})
			} else {
				setSelectedSectionId(null)
			}
		}
		if (usersRes.success && usersRes.data) {
			setAllUsers(usersRes.data)
		}
	}

	function showNotification(msg) {
		setSuccessMsg(msg)
		setTimeout(() => setSuccessMsg(''), 3500)
	}

	const role = user?.role || 'student'
	const teachers = allUsers.filter((u) => u.role === 'teacher' || u.role === 'admin')
	const allStudents = allUsers.filter((u) => u.role === 'student')

	if (role === 'student') {
		return (
			<div className="page-layout">
				<Sidebar />
				<div className="page-container">
					<div className="classrooms-access-denied">
						<h2>Classrooms Portal</h2>
						<p>
							This portal is restricted to Teachers and Administrators for
							classroom section administration and student roster management.
						</p>
						<Link to="/dashboard" className="btn-return-dashboard">
							Back to Dashboard
						</Link>
					</div>
				</div>
			</div>
		)
	}

	const activeSection =
		sections.find((s) => s.id === Number(selectedSectionId)) || sections[0] || null

	const sectionStudents = allStudents.filter((s) => {
		if (!activeSection) return false
		return String(s.section_id || s.section?.id) === String(activeSection.id)
	})

	const candidateStudents = allStudents.filter((s) => {
		return String(s.section_id || s.section?.id) !== String(activeSection?.id)
	})

	function openCreateModal() {
		setIsCreateModalOpen(true)
	}

	async function handleCreateSection(formValues) {
		const payload = {
			name: formValues.name.trim(),
			code: formValues.code.trim().toUpperCase(),
			teacher_id: parseInt(formValues.teacher_id || user.id),
		}
		const res = await createSection(payload)
		if (res.success && res.data) {
			setIsCreateModalOpen(false)
			await refreshData()
			setSelectedSectionId(res.data.id)
			showNotification(`Classroom "${res.data.name}" created successfully!`)
		}
		return res
	}

	async function handleSaveEditSection(formValues) {
		const payload = {
			name: formValues.name.trim(),
			code: formValues.code.trim().toUpperCase(),
			teacher_id: parseInt(formValues.teacher_id || editingSection.teacher_id || user.id),
		}
		const res = await updateSection(editingSection.id, payload)
		if (res.success && res.data) {
			setEditingSection(null)
			await refreshData()
			showNotification(`Classroom "${res.data.name}" updated successfully!`)
		}
		return res
	}

	async function handleConfirmDeleteSection() {
		if (!sectionToDelete) return
		const targetId = sectionToDelete.id
		const targetName = sectionToDelete.name
		setSectionToDelete(null)
		const res = await deleteSection(targetId)
		if (res.success) {
			await refreshData()
			showNotification(`Classroom "${targetName}" deleted.`)
		} else {
			setError(res.message || 'Failed to delete classroom.')
		}
	}

	async function handleEnrollStudent(studentId) {
		if (!activeSection) return
		const res = await updateUser(studentId, { section_id: activeSection.id })
		if (res.success) {
			await refreshData()
			showNotification('Student added to classroom successfully.')
		} else {
			setError(res.message || 'Failed to enroll student.')
		}
	}

	async function handleConfirmRemoveStudent() {
		if (!studentToRemove) return
		const targetStudent = studentToRemove
		setStudentToRemove(null)
		const res = await updateUser(targetStudent.id, { section_id: null })
		if (res.success) {
			await refreshData()
			showNotification(`${targetStudent.username} unassigned from ${activeSection?.name}.`)
		} else {
			setError(res.message || 'Failed to remove student from classroom.')
		}
	}

	function handleCopySectionCode(code) {
		if (!code) return
		navigator.clipboard.writeText(code)
		setCopyCodeSuccess(true)
		setTimeout(() => setCopyCodeSuccess(false), 2000)
	}

	return (
		<div className="page-layout">
			<Sidebar />
			<div className="page-container">
				<div className="classrooms-main-container">
					<ClassroomSelector
						sections={sections}
						activeSection={activeSection}
						onSelectSection={setSelectedSectionId}
						onCopyCode={handleCopySectionCode}
						copyCodeSuccess={copyCodeSuccess}
						role={role}
						userId={user?.id}
						onEdit={setEditingSection}
						onDelete={setSectionToDelete}
						onCreate={openCreateModal}
					/>

					{successMsg && <div className="classrooms-toast-success">{successMsg}</div>}
					{error && <div className="classrooms-toast-error">{error}</div>}

					{activeSection ? (
						<RosterTable
							sectionName={activeSection.name}
							students={sectionStudents}
							onAddStudent={() => setIsEnrollModalOpen(true)}
							onRemoveStudent={setStudentToRemove}
						/>
					) : (
						<div className="classrooms-zero-state">
							<h3>No Classrooms Found</h3>
							<p>
								Create your first classroom section to start organizing and
								managing students.
							</p>
							<button className="btn-primary-action" onClick={openCreateModal}>
								Add Classroom
							</button>
						</div>
					)}
				</div>

				{isEnrollModalOpen && (
					<EnrollStudentModal
						sectionName={activeSection?.name}
						candidates={candidateStudents}
						onEnroll={handleEnrollStudent}
						onClose={() => setIsEnrollModalOpen(false)}
					/>
				)}

				{isCreateModalOpen && (
					<SectionFormModal
						mode="create"
						initialValues={{
							name: '',
							code: '',
							teacher_id: role === 'teacher' ? user.id : teachers[0]?.id || '',
						}}
						teachers={teachers}
						role={role}
						currentUsername={user?.username}
						onSubmit={handleCreateSection}
						onClose={() => setIsCreateModalOpen(false)}
					/>
				)}

				{editingSection && (
					<SectionFormModal
						mode="edit"
						initialValues={{
							name: editingSection.name || '',
							code: editingSection.code || '',
							teacher_id:
								editingSection.teacher_id || editingSection.teacher?.id || teachers[0]?.id || '',
						}}
						teachers={teachers}
						role={role}
						currentUsername={user?.username}
						onSubmit={handleSaveEditSection}
						onClose={() => setEditingSection(null)}
					/>
				)}

				<ConfirmModal
					isOpen={sectionToDelete !== null}
					title="Delete Classroom"
					message={`Are you sure you want to delete classroom "${sectionToDelete?.name}"? Enrolled students will become unassigned.`}
					onConfirm={handleConfirmDeleteSection}
					onCancel={() => setSectionToDelete(null)}
				/>
				<ConfirmModal
					isOpen={studentToRemove !== null}
					title="Remove Student"
					message={`Are you sure you want to unassign "${studentToRemove?.username}" from "${activeSection?.name}"?`}
					onConfirm={handleConfirmRemoveStudent}
					onCancel={() => setStudentToRemove(null)}
				/>
			</div>
		</div>
	)
}