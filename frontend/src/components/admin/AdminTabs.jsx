import './AdminTabs.css'

export default function AdminTabs({
	activeTab,
	onSelectTab,
	userCount,
	sectionCount
}) {
	return (
		<div className="admin-nav-bar">
			<div className="admin-tab-nav">
				<button
					className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
					onClick={() => onSelectTab('users')}
				>
					Users Directory ({userCount})
				</button>
				<button
					className={`admin-tab-btn ${activeTab === 'sections' ? 'active' : ''}`}
					onClick={() => onSelectTab('sections')}
				>
					Classroom Sections ({sectionCount})
				</button>
			</div>
		</div>
	)
}
