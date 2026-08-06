import './Footer.css';

export default function Footer() {
  return (
    <footer className="landing-footer">
      <div className="footer-container">
        <div className="footer-col">
          <h3 className="footer-brand">VERIVERDAD</h3>
          <p className="footer-tagline">Verify before you share.</p>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Explore</h4>
          <ul className="footer-links">
            <li><a href="https://github.com/zamuwelle/VeriVerdad" target="_blank" rel="noreferrer">GitHub Project</a></li>
            <li><a href="#framework">Framework</a></li>
            <li><a href="#features">Features</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Hackathon</h4>
          <p className="footer-text">Built for the UNESCO Youth Hackathon 2026</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Built with 🩶 by the VeriVerdad Team</p>
      </div>
    </footer>
  );
}
