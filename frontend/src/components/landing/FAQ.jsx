import { useState } from 'react'
import { Chevron } from '../shared/icons'
import './FAQ.css'

export default function FAQ() {
	const [openIndices, setOpenIndices] = useState({})

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
	]

	function toggle(idx) {
		setOpenIndices(function (prev) {
			return { ...prev, [idx]: !prev[idx] }
		})
	}

	return (
		<section className="landing-faq" id="faq">
			<div className="faq-container">
				<h2 className="faq-title">Frequently Asked Questions</h2>
				<div className="faq-list">
					{faqs.map(function (faq, idx) {
						const isOpen = !!openIndices[idx]
						return (
							<div key={idx} className={`faq-item${isOpen ? ' open' : ''}`}>
								<button
									type="button"
									className="faq-question-btn"
									onClick={function () {
										toggle(idx)
									}}
								>
									<span className="faq-question-text">{faq.q}</span>
									<span className="faq-icon">
										<Chevron open={isOpen} />
									</span>
								</button>
								{isOpen && <p className="faq-answer">{faq.a}</p>}
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}