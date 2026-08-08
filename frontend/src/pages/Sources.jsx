import { useState, useEffect } from 'react'
import { getBadges, getProfile } from '../api.js'
import './Sources.css'
import Sidebar from '../components/dashboard/Sidebar'
import BadgeCard from '../components/dashboard/BadgeCard'

const guidelines = [
	{
		tag: 'AUTHORITY',
		title: 'Cross-Check Author Credentials',
		body: 'Always verify if the publisher or content creator has established domain expertise and verifiable affiliations before trusting news reports.',
	},
	{
		tag: 'CURRENCY',
		title: 'Check Publication Timestamp',
		body: 'Ensure old news reports or recycled media clips from past years are not being misrepresented as current live events.',
	},
	{
		tag: 'PURPOSE',
		title: 'Identify Intended Bias & Engagement Bait',
		body: 'Distinguish between objective investigative journalism and emotionally driven clickbait designed to exploit parasocial attachment.',
	},
]

export default function Sources() {
	const [badges, setBadges] = useState([])
	const [userBadges, setUserBadges] = useState([])

	useEffect(function () {
		async function fetchSourcesData() {
			const res = await getBadges()
			if (res.success && res.data) {
				setBadges(res.data)
			}

			const profileRes = await getProfile()
			if (profileRes.success && profileRes.data && profileRes.data.badges) {
				setUserBadges(profileRes.data.badges.map((b) => b.id))
			}
		}
		fetchSourcesData()
	}, [])

	return (
		<div className="page-layout">
			<Sidebar />
			<div className="page-container">
				<section className="sources-section">
					<h2>Academic Badges</h2>
					<div className="badges-grid">
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
								No badges loaded.
							</p>
						)}
					</div>
				</section>

				<section className="sources-section">
					<h2>Fact-Checking & Credibility Guidelines</h2>
					<div className="sources-list">
						{guidelines.map(function (item) {
							return (
								<div key={item.tag} className="source-item">
									<span className="source-tag">{item.tag}</span>
									<h4>{item.title}</h4>
									<p>{item.body}</p>
								</div>
							)
						})}
					</div>
				</section>
			</div>
		</div>
	)
}