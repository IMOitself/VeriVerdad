import { Link } from 'react-router';
import './MeetVeriBot.css';

export default function MeetVeriBot() {
  return (
    <section className="landing-veribot" id="veribot">
      <div className="veribot-container">

        {/* Left: Mascot Showcase */}
        <div className="veribot-visual">
          <div className="mascot-card">
            <img src="/mascot.png" alt="VeriBot Mascot" className="veribot-mascot-img" />
            <div className="mascot-card-footer">
              <span className="mascot-name">VeriBot</span>
              <span className="mascot-role">AI Fact-Checking Mentor</span>
            </div>
          </div>
        </div>

        {/* Right: VeriBot Introduction */}
        <div className="veribot-info">
          <div className="veribot-eyebrow">Meet Your AI Guide</div>
          <h2 className="veribot-heading">This is VeriBot, your personal digital detective.</h2>
          <p className="veribot-description">
            VeriBot doesn't just hand you answers. It walks alongside you, asking the questions that teach you how to spot misinformation, break through Idol Bias, and verify claims the way real journalists do.
          </p>

          <div className="veribot-features-list">
            <div className="veribot-feature-item">
              <span className="feature-bullet">01</span>
              <div>
                <h4>Asks Before It Answers</h4>
                <p>Uses Socratic questioning across the 5 CRAAP pillars so you build the skill, not the dependency.</p>
              </div>
            </div>
            <div className="veribot-feature-item">
              <span className="feature-bullet">02</span>
              <div>
                <h4>Detects Idol Bias in Real Time</h4>
                <p>Flags when you're about to share something because of who said it, not because it is true.</p>
              </div>
            </div>
            <div className="veribot-feature-item">
              <span className="feature-bullet">03</span>
              <div>
                <h4>Grounds Every Response in Live Sources</h4>
                <p>Searches the web for real published evidence and shows you exactly where it came from.</p>
              </div>
            </div>
          </div>

          <div className="veribot-cta">
            <Link to="/login" className="btn-veribot">Start with VeriBot</Link>
          </div>
        </div>

      </div>
    </section>
  );
}
