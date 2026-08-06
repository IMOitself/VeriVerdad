import { useState } from 'react';
import './FAQ.css';

export default function FAQ() {
  const [openIndices, setOpenIndices] = useState({});

  const faqs = [
    {
      q: 'What is Idol Bias?',
      a: 'Idol Bias happens when we uncritically believe false claims simply because they come from a personality, creator, or political figure we admire.'
    },
    {
      q: 'Does VeriVerdad just tell students what is true or false?',
      a: 'No. VeriVerdad uses Socratic questioning to teach students the method of verification so they can spot fake news anywhere on the web.'
    },
    {
      q: 'Who is this designed for?',
      a: 'It is designed for students, educators, and classrooms learning Media and Information Literacy (MIL).'
    }
  ];

  const toggle = (idx) => {
    setOpenIndices((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <section className="landing-faq" id="faq">
      <div className="faq-container">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, idx) => {
            const isOpen = !!openIndices[idx];
            return (
              <div key={idx} className={`faq-item${isOpen ? ' open' : ''}`}>
                <button type="button" className="faq-question-btn" onClick={() => toggle(idx)}>
                  <span className="faq-question-text">{faq.q}</span>
                  <span className="faq-icon">
                    {isOpen ? (
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                        <path d="m280-400 200-200 200 200H280Z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                        <path d="M480-360 280-560h400L480-360Z" />
                      </svg>
                    )}
                  </span>
                </button>
                {isOpen && <p className="faq-answer">{faq.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
