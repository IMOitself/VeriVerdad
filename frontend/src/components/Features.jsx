import './Features.css';

export default function Features() {
  const features = [
    {
      title: 'Question Like a Detective',
      description: 'VeriBot doesn\'t spoon-feed you answers. It asks the right questions so you learn how to evaluate evidence on your own.'
    },
    {
      title: 'Break Free from Idol Bias',
      description: 'Recognize when emotional loyalty to influencers, celebrities, or politicians blinds you to manipulated facts.'
    },
    {
      title: 'Real-World Practice',
      description: 'Analyze simulated viral posts, fabricated quotes, and misleading headlines in a safe classroom sandbox.'
    }
  ];

  return (
    <section className="landing-features" id="features">
      <div className="features-container">
        <h2 className="features-title">Built for the next generation of truth-seekers</h2>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <article key={idx} className="feature-card">
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-desc">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
