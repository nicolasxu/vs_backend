module.exports = {
	accountExist: {
		code: 4001, 
		data: {
			message:"account already existed (activated)"}
	},
	invalidEmail: {
		code: 4002, 
		data: {
			message: "email is invalid"
		}
	},
	weakPassword: {
		code: 4003, 
		data: {
			message: 
			"password does not meet min requirement"
		}
	},
	unknownError: {
		code: 4004, data:{
			message: "create user failed, unknown error"
		}
	},
	createUserSuccess: {
		code: 2000, 
		data: {
			message: "Account successfully created"
		}
	},
	createUserError: {
		code: 4014,
		data: {
			message: "Register User error"
		}
	},
	getUserSuccess: {
		code: 2000, 
		data: {
			message: "Get user info success"
		}
	},
	// login
	userNotExist: {
		code: 4005, 
		data: {
			message: "User doesn't exist"
		}
	},
	unknownLoginError: {
		code: 4006, 
		data: {
			message: "Login error"
		}
	}, 
	userLoginSuccess: {
		code: 2000, 
		data: {
			message: "User login success"
		}
	},
	passwordNotMatch: {
		code: 4007, 
		data: {
			message: "Password doesn't match"
		}
	},
	userNotLogin: {
		code: 4008, 
		data: {
			message: "User is not login"
		}
	},
	userLogoutSuccess: {
		code: 2000, 
		data: {
			message: "user logout success"
		}
	},
	// create company
	userHasCompanyAlready: {
		code: 4009, 
		data: {
			message: "User has already created or joined company"
		}
	},
	createCompanySuccess: {
		code: 2000, 
		data: {
			message: "Create user company success"
		}
	},
	getCompanySuccess: {
		code: 2000, 
		data: {
			message: "Get my company success"
		}
	},
	// create client
	createClientError: {
		code: 4010, 
		data: {
			message: "Create Client Error"
		}
	},
	createClientSuccess: {
		code: 2000, 
		data: {
			message: "Create Client Success"
		}
	},
	// invoice
	companyIdNotValid: {
		code: 4011, 
		data: {
			message: "Receiver company ID is not valid"
		}
	}, 
	receiverNotExist: {
		code: 4012, 
		data: {
			message: "Receiver company does not exist"
		}
	},
	toCompanyIdNotValid: {
		code: 4013, 
		data: {
			message: "Receiver company doesn't exist"
		}
	},
	sendInvoiceSuccess: {
		code: 2000, 
		data: {
			message: "Send invoice success"
		}
	},
	getInvoiceListSuccess: {
		code: 2000, 
		data: {
			message: "Get invoice list success"
		}
	},
	// client
	myCompanyNotExist: {
		code: 4013, 
		data: {
			message: "Your company not exist"
		}
	},
	getClientsSuccess: {
		code: 2000, 
		data: {
			message: "Get client list success"
		}
	},
	findPublicCompanyErr: {
		code: 4015,
		data: {
			message: "Find Active companies error"
		}
	},
	findPublicCompanySucceed: {
		code: 2000,
		data: {
			message: "Find public companies succeed"
		}
	},
	// vendor
	getVendorsSuccess: {
		code: 2000, 
		data: {
			message: "Get vendor list success"
		}
	},
	// template
	companyTemplateEmpty: {
		code: 4014, 
		data: {
			message: "Company templates are empty"
		}
	},
	getTemplatesSuccess: {
		code: 2000, 
		data: {
			message: "Get invoice templates success"
		}
	}
}