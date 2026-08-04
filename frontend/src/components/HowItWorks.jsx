import './HowItWorks.css';

export default function HowItWorks() {
  const steps = [
    {
      title: 'Spot the Claim',
      desc: 'Paste a suspicious post, quote, or article link into the verifier.'
    },
    {
      title: 'Investigate Laterally',
      desc: 'Answer guided questions to check who is behind the source and what other independent outlets say.'
    },
    {
      title: 'Decide with Evidence',
      desc: 'Review your verification breakdown and build the habit of thinking before sharing.'
    }
  ];

  return (
    <section className="landing-how" id="how-it-works">
      <div className="how-container">
        <h2 className="how-title">3 Steps to Verify Any Claim</h2>
        <div className="how-grid">
          {steps.map((step, idx) => (
            <div key={idx} className="how-card">
              <h3 className="how-card-title">{step.title}</h3>
              <p className="how-card-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
