import './Veribot.css';
import Sidebar from '../components/dashboard/Sidebar';

export default function Veribot() {
	return (
		<div className="page-layout">
			<Sidebar />
			<main className="page-content">
				<h1>VeriBot AI</h1>
			</main>
		</div>
	);
}
