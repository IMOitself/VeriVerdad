import { register, login } from './api.js'

const registerTest = await register({
	username: 'testuser',
	email: 'test@test.com',
	password: 'password123'
})
console.log('Register:', registerTest)

const loginTest = await login({
	email: 'testi@test.com',
	password: 'password123'
})
console.log('Login:', loginTest)