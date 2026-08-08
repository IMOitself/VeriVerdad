import { useState } from 'react'

export default function useCurrentUser() {
	return useState(function () {
		try {
			return JSON.parse(localStorage.getItem('user'))
		} catch (e) {
			return null
		}
	})
}