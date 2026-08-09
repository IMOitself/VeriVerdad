import './SectionStatusBanner.css'

export default function SectionStatusBanner({ role, assignedSection, taughtSections }) {
	if (role === 'student' && !assignedSection) {
		return (
			<div className="hero-top-info">
				<span>You are not assigned to a classroom section yet.</span>
			</div>
		)
	}

	if (role === 'teacher' && (!taughtSections || taughtSections.length === 0)) {
		return (
			<div className="hero-top-info">
				<span>You are not assigned to any classroom sections yet.</span>
			</div>
		)
	}

	return null
}