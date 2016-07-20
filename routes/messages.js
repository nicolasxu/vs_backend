module.exports = {
	accountExist: {code: 4001, message: "account already existed (activated)"},
	invalidEmail: {code: 4002, message: "email is invalid"},
	weakPassword: {code: 4003, message: "password does not meet min requirement"},
	unknownError: {code: 4004, message: "create user failed, unknown error"},
	createUserSuccess: {code: 2000, message: "Account successfully created"},
	getUserSuccess: {code: 2000, message: "Get user info success"},
	// login
	userNotExist: {code: 4005, message: "User doesn't exist"},
	unknownLoginError: {code: 4006, message: "Login error"}, 
	userLoginSuccess: {code: 2000, message: "User login success"},
	passwordNotMatch: {code: 4007, message: "Password doesn't match"},
	userNotLogin: {code: 4008, message: "User is not login"},
	userLogoutSuccess: {code: 2000, message: "user logout success"},
	// create company
	userHasCompanyAlready: {code: 4009, message: "User has already created or joined company"},
	createCompanySuccess: {code: 2000, message: "Create user company success"},
	getCompanySuccess: {code: 2000, message: "Get my company success"},
	// create client
	createClientError: {code: 4010, message: "Create Client Error"},
	createClientSuccess: {code: 2000, message: "Create Client Success"},
	// invoice
	companyIdNotValid: {code: 4011, message: "Receiver company ID is not valid "}, 
	receiverNotExist: {code: 4012, message: "Receiver company does not exist"},
	toCompanyIdNotValid: {code: 4013, message: "Receiver company doesn't exist"},
	sendInvoiceSuccess: {code: 2000, message: "Send invoice success"},
	getInvoiceListSuccess: {code: 2000, message: "Get invoice list success"}
}