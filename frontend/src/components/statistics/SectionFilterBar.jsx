import './SectionFilterBar.css'

export default function SectionFilterBar({
	sections,
	selectedSectionId,
	onChange,
	role
}) {
	return (
		<div className="stats-section-filter-bar">
			<div className="filter-text">
				<h2>Classroom Diagnostics & Analytics</h2>
				<p>
					Real-time MIL verification metrics, CRAAP breakdowns, and section
					rosters
				</p>
			</div>
			<div className="filter-controls">
				<label htmlFor="stats_section_select">Classroom Section:</label>
				<select
					id="stats_section_select"
					className="section-select-dropdown"
					value={selectedSectionId}
					onChange={onChange}
				>
					<option value="">
						{role === 'teacher' ? 'All My Sections' : 'All Classroom Sections'}
					</option>
					{sections.map(function (sec) {
						return (
							<option key={sec.id} value={sec.id}>
								{sec.name} ({sec.code}){' '}
								{role === 'admin' && sec.teacher
									? `— ${sec.teacher.username}`
									: ''}
							</option>
						)
					})}
				</select>
			</div>
		</div>
	)
}