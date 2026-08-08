import './SectionStatusBanner.css'

export default function SectionStatusBanner({ role, assignedSection, taughtSections }) {
	return (
		<div className="hero-top-info">
			{role === 'student' &&
				(assignedSection ? (
					<div
						className="section-pill-tag assigned"
						title="Assigned Classroom Section"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 -960 960 960"
						>
							<path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-109v-151l-200 109-200-109v151l200 109Zm0-241Zm0 90Zm0 0Z" />
						</svg>
						<span>
							Classroom Section: <strong>{assignedSection.name}</strong>{' '}
							<span className="section-code-pill-sm chip chip--mono">
								{assignedSection.code}
							</span>
						</span>
					</div>
				) : (
					<div
						className="section-pill-tag unassigned"
						title="No section assigned yet"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 -960 960 960"
						>
							<path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" />
						</svg>
						<span>
							Section: <strong>Unassigned</strong>{' '}
							<span className="unassigned-hint">
								(Contact your teacher)
							</span>
						</span>
					</div>
				))}

			{role === 'teacher' && (
				<div className="teacher-sections-banner">
					<div className="teacher-banner-label">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 -960 960 960"
						>
							<path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-109v-151l-200 109-200-109v151l200 109Zm0-241Zm0 90Zm0 0Z" />
						</svg>
						<span>Teaching Sections:</span>
					</div>
					<div className="teacher-sections-pills">
						{taughtSections && taughtSections.length > 0 ? (
							taughtSections.map((sec) => (
								<span key={sec.id} className="teacher-section-badge-sm">
									{sec.name}{' '}
									<span className="section-code-pill-sm chip chip--mono">
										{sec.code}
									</span>
								</span>
							))
						) : (
							<span className="teacher-section-badge-sm empty">
								No sections assigned yet
							</span>
						)}
					</div>
				</div>
			)}
		</div>
	)
}