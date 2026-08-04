import './SocialProof.css';

export default function SocialProof() {
  const items = [
    'UNESCO Youth Hackathon 2026',
    'DepEd MIL Aligned',
    'CRAAP Framework',
    'Powered by Gemini AI',
    'Open Source',
  ];

  return (
    <section className="landing-social-proof">
      <div className="social-proof-container">
        <span className="social-proof-label">Trusted by</span>
        <div className="social-proof-divider" />
        <div className="social-proof-items">
          {items.map((item, idx) => (
            <span key={idx} className="social-proof-item">{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
