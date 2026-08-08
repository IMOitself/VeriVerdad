import './BadgeCard.css'

const badgeIcons = {
	Currency: (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
			<path d="M160-80q-33 0-56.5-23.5T80-160v-560q0-33 23.5-56.5T160-800h40v-80h80v80h400v-80h80v80h40q33 0 56.5 23.5T880-720v560q0 33-23.5 56.5T800-80H160Zm0-80h640v-400H160v400Zm180-140-60-60 56-56 104 104 180-180 56 56-236 236Z" />
		</svg>
	),
	Relevance: (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
			<path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Zm0-160q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Z" />
		</svg>
	),
	Authority: (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
			<path d="M480-80q-140-35-230-155.5T160-480v-320l320-80 320 80v320q0 124-90 244.5T480-80ZM440-360 300-500l56-56 84 84 160-160 56 56-216 216Z" />
		</svg>
	),
	Accuracy: (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
			<path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-80-200 280-280-56-56-224 224-104-104-56 56 160 160Z" />
		</svg>
	),
	Purpose: (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
			<path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM480-160q-134 0-249-65T80-500q36-110 151-175t249-65q134 0 249 65t151 175q-36 110-151 175t-249 65Z" />
		</svg>
	)
}

export default function BadgeCard({ number, name, description, unlocked }) {
	const iconSvg = badgeIcons[name] || String(number).padStart(2, '0')

	return (
		<div className={`badge-card ${unlocked ? 'unlocked' : 'locked'}`}>
			<div className="badge-icon">{iconSvg}</div>
			<div className="badge-info">
				<h4>{name}</h4>
				<p>{description}</p>
			</div>
			<span className="badge-status">{unlocked ? 'Unlocked' : 'Locked'}</span>
		</div>
	)
}