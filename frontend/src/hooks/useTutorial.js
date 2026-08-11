import { useState, useCallback } from 'react'

// The ordered list of tutorial steps.
// Each step has a target selector, a title, and a description.
const STEPS = [
	{
		target: '[data-tour="sidebar"]',
		title: 'Navigation',
		description: 'Use the sidebar to move between different sections of VeriVerdad.'
	},
	{
		target: '[data-tour="sidebar-veribot"]',
		title: 'Verify Claims',
		description: 'Click here to go to VeriBot — your AI fact-checking assistant.'
	},
	{
		target: '[data-tour="sidebar-history"]',
		title: 'History',
		description: 'Review all your past fact-checks here.'
	},
	{
		target: '[data-tour="tutorial"]',
		title: 'Have Fun :D',
		description: 'You can click the ? button anytime to see this tutorial again.'
	}
]

export default function useTutorial() {
	const [isActive, setIsActive] = useState(false)
	const [currentStepIndex, setCurrentStepIndex] = useState(0)

	function start() {
		setCurrentStepIndex(0)
		setIsActive(true)
	}

	function next() {
		if (currentStepIndex < STEPS.length - 1) {
			setCurrentStepIndex(currentStepIndex + 1)
		} else {
			finish()
		}
	}

	// Go to previous step
	function prev() {
		if (currentStepIndex > 0) {
			setCurrentStepIndex(currentStepIndex - 1)
		}
	}

	function skip() {
		setIsActive(false)
	}

	function finish() {
		setIsActive(false)
	}

	const restart = useCallback(start, [])

	return {
		isActive,
		currentStep: STEPS[currentStepIndex],
		currentStepIndex,
		steps: STEPS,
		totalSteps: STEPS.length,
		next,
		prev,
		skip,
		restart
	}
}
