import './Veribot.css';
import Sidebar from '../components/dashboard/Sidebar';

export default function Veribot() {
	return (
		<div className="page-layout">
			<Sidebar />
			<div className="veribot-container">
				<div className="chat-messages-area">
					<div className="chat-message bot">
						<div className="avatar">AI</div>
						<div className="message-content">
							<p>Hello! I am VeriBot. Paste any news link, social media post, or claim below, and I will guide you through evaluating its credibility step-by-step.</p>
						</div>
					</div>

					<div className="chat-message user">
						<div className="avatar">YOU</div>
						<div className="message-content">
							<p>https://news-update-2026.net/celebrity-endorsed-health-miracle</p>
						</div>
					</div>

					<div className="chat-message bot">
						<div className="avatar">AI</div>
						<div className="message-content">
							<p>I have processed the link. Let's deconstruct this article across the 5 CRAAP pillars to check for Idol Bias and factual accuracy.</p>
							
							<div className="inline-quiz-box">
								<span className="quiz-pillar-tag">PILLAR 1 OF 5: AUTHORITY</span>
								<h3>Question 1: Author Credentials</h3>
								<p>Who is listed as the author of this medical claim, and what verified scientific credentials do they hold?</p>

								<div className="inline-options">
									<button className="inline-opt">
										<span className="opt-key">A</span>
										<span>The author is a board-certified physician with peer-reviewed research.</span>
									</button>

									<button className="inline-opt">
										<span className="opt-key">B</span>
										<span>The author is an anonymous account citing an unverified influencer video.</span>
									</button>

									<button className="inline-opt">
										<span className="opt-key">C</span>
										<span>The article relies solely on personal celebrity quotes without medical data.</span>
									</button>

									<button className="inline-opt">
										<span className="opt-key">D</span>
										<span>No author name or publishing organization is listed anywhere.</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="chat-input-bar">
					<input type="text" placeholder="Paste a link or type a claim to verify..." />
					<button className="btn-chat-send">Send</button>
				</div>
			</div>
		</div>
	);
}
