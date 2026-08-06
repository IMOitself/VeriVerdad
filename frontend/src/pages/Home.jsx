import './Home.css';
import Sidebar from '../components/dashboard/Sidebar';

export default function Home() {
	return (
		<div className="page-layout">
			<Sidebar />
			<main className="page-content">
				<h1>Home</h1>
			</main>
		</div>
	);
}
