module.exports = {
	passwordWrong : {
		code: 3001,
		data: {
			message: 'password is wrong or account doesn not exist'
		}
	},
	createUserError: {
		code: 3002,
		data: {
			message: 'create user error'
		}
	},
	createTokenSuccess : {
		code: 2000,
		data: {
			message: 'Create token success'
		}
	},
	createUserSuccess: {
		code: 2000,
		data: {
			message: 'Create user successful'
		}
	}
}