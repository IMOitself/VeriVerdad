import { Link } from 'react-router';
import './Navbar.css';

export default function Navbar() {
  return (
    <header className="landing-header">
      <div className="landing-brand">
        <img src="/logo.png" alt="VeriVerdad Logo" className="brand-logo" />
        <span className="brand-title">VERIVERDAD</span>
      </div>

      <nav className="landing-nav">
        <a href="#features" className="nav-link">Features</a>
        <a href="#framework" className="nav-link">Framework</a>
        <a href="#how-it-works" className="nav-link">How It Works</a>
        <a href="#faq" className="nav-link">FAQ</a>
      </nav>

      <div className="landing-nav-actions">
        <Link to="/login" className="btn-login">Sign In</Link>
      </div>
    </header>
  );
}
