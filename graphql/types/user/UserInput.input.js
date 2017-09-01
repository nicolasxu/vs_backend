// when changing email, make sure the new email is not in used as
// 1. active user(don't update in this case), at the same time, remove all unactive user with the same email
// 2. - new email could be some company's private clients receiving email
//        (if new email exists in private client, don't do this email change)
//    - new email could be receiving email of sent invoice (do nothing)

// UserEmailInput is for updating email only

module.exports = `

input UserInput {
  firstName: String
  lastName: String
  role: String
  password: String
}

input UserEmailInput {
  email: String
}


`