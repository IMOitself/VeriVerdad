import './Pillars.css';

export default function Pillars() {
  const pillars = [
    {
      name: 'Currency',
      question: 'When was this published? Is it outdated or recirculated?'
    },
    {
      name: 'Relevance',
      question: 'Does the evidence actually support the claim being made?'
    },
    {
      name: 'Authority',
      question: 'Who created this, and what makes them qualified?'
    },
    {
      name: 'Accuracy',
      question: 'Are there real primary sources and verifiable facts?'
    },
    {
      name: 'Purpose',
      question: 'Why was this posted—to inform, persuade, sell, or mislead?'
    }
  ];

  return (
    <section className="landing-pillars" id="framework">
      <div className="pillars-container">
        <h2 className="pillars-title">The 5 Checks for Every Source (CRAAP)</h2>
        <div className="pillars-list">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="pillar-item">
              <span className="pillar-name">{pillar.name}</span>
              <p className="pillar-desc">{pillar.question}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
