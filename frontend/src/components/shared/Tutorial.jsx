import { useState, useEffect, useCallback } from 'react'
import './Tutorial.css'

// Tutorial overlay component.
// Props come from the useTutorial hook:
//   isActive, currentStep, currentStepIndex, steps, totalSteps,
//   next, prev, skip

export default function Tutorial({
	isActive,
	currentStep,
	currentStepIndex,
	steps,
	totalSteps,
	next,
	prev,
	skip
}) {
	// Position state for the spotlight and tooltip
	const [spotlightStyle, setSpotlightStyle] = useState({})
	const [tooltipStyle, setTooltipStyle] = useState({})

	// Calculate positions based on the target element
	const updatePositions = useCallback(function () {
		if (!isActive || !currentStep) return

		var target = document.querySelector(currentStep.target)
		if (!target) return

		// Scroll the target into view if needed
		target.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

		// Small delay so scroll finishes before we measure
		setTimeout(function () {
			var rect = target.getBoundingClientRect()
			var padding = 8 // extra space around the element

			// Spotlight position (covers the target element)
			setSpotlightStyle({
				top: rect.top - padding + 'px',
				left: rect.left - padding + 'px',
				width: rect.width + padding * 2 + 'px',
				height: rect.height + padding * 2 + 'px'
			})

			// Figure out where to put the tooltip
			// Try below first, then above, then to the right
			var tooltipWidth = 320
			var tooltipHeight = 180
			var gap = 16

			var spaceBelow = window.innerHeight - rect.bottom
			var spaceAbove = rect.top
			var spaceRight = window.innerWidth - rect.right

			var top, left

			if (spaceBelow > tooltipHeight + gap) {
				// Place below
				top = rect.bottom + gap
				left = rect.left
			} else if (spaceAbove > tooltipHeight + gap) {
				// Place above
				top = rect.top - tooltipHeight - gap
				left = rect.left
			} else if (spaceRight > tooltipWidth + gap) {
				// Place to the right
				top = rect.top
				left = rect.right + gap
			} else {
				// Fallback: place below anyway
				top = rect.bottom + gap
				left = rect.left
			}

			// Make sure tooltip doesn't go off-screen horizontally
			if (left + tooltipWidth > window.innerWidth - 16) {
				left = window.innerWidth - tooltipWidth - 16
			}
			if (left < 16) {
				left = 16
			}

			// Make sure tooltip doesn't go off-screen vertically
			if (top < 16) {
				top = 16
			}

			setTooltipStyle({
				top: top + 'px',
				left: left + 'px'
			})
		}, 100)
	}, [isActive, currentStep])

	// Recalculate when step changes or window resizes
	useEffect(function () {
		if (!isActive) return

		updatePositions()

		window.addEventListener('resize', updatePositions)
		return function () {
			window.removeEventListener('resize', updatePositions)
		}
	}, [isActive, currentStepIndex, updatePositions])

	// Keyboard support: arrows for nav, escape to skip
	useEffect(function () {
		if (!isActive) return

		function handleKeyDown(e) {
			if (e.key === 'ArrowRight' || e.key === 'Enter') {
				next()
			} else if (e.key === 'ArrowLeft') {
				prev()
			} else if (e.key === 'Escape') {
				skip()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return function () {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [isActive, next, prev, skip])

	// Don't render anything if the tutorial is not active
	if (!isActive || !currentStep) return null

	var isLastStep = currentStepIndex === totalSteps - 1
	var isFirstStep = currentStepIndex === 0

	return (
		<>
			{/* Clickable overlay — clicking it skips the tutorial */}
			<div className="tutorial-overlay" onClick={skip} />

			{/* Spotlight cutout */}
			<div className="tutorial-spotlight" style={spotlightStyle} />

			{/* Tooltip card */}
			<div className="tutorial-tooltip" style={tooltipStyle}>
				<h3 className="tutorial-tooltip-title">{currentStep.title}</h3>
				<p className="tutorial-tooltip-desc">{currentStep.description}</p>

				<div className="tutorial-tooltip-footer">
					{/* Step dots */}
					<div className="tutorial-dots">
						{steps.map(function (step, i) {
							return (
								<span
									key={i}
									className={'tutorial-dot' + (i === currentStepIndex ? ' active' : '')}
								/>
							)
						})}
					</div>

					{/* Navigation buttons */}
					<div className="tutorial-btn-group">
						{!isFirstStep && (
							<button className="tutorial-btn tutorial-btn-back" onClick={prev}>
								Back
							</button>
						)}
						<button className="tutorial-btn tutorial-btn-next" onClick={next}>
							{isLastStep ? 'Got it!' : 'Next'}
						</button>
					</div>
				</div>

				<button className="tutorial-skip-link" onClick={skip}>
					Skip tutorial
				</button>
			</div>
		</>
	)
}
