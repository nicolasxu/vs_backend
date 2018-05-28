
module.exports = validateBankAccount

function validateBankAccount(bankAccount) {
  
  if (!bankAccount) {
    return false
  }

  if (typeof bankAccount !== 'string') {
    return false
  }

  if (bankAccount.length < 4 || bankAccount.length > 17) {
    return false
  }

  return /^\d+$/.test(bankAccount)

}