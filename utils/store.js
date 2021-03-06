module.exports = {
  // will attach data to this store object
  getUserId: function () {
    let userId = this.user && this.user._id
    return userId
  },
  getEmail: function () {
    let email = this.user && this.user.email
    return email
  },
  getUserFullname: function () {
    if (!this.user) {
      throw new Error('User object does not exist in store')
    }

    let firstName = this.user.firstName? this.user.firstName: ''
    let lastName = this.user.lastName? this.user.lastName: ''

    let fullName = firstName + ' ' + lastName
    fullName = fullName.trim()
    if (fullName === '') {
      return 'n/a'
    } else {
      return fullName
    }
  },
  getDomainName: function () {
    if (process.env.NODE_ENV === 'production') {
      return 'https://vitaspider.com/#'
    } else {
      return 'http://localhost:8090/#'
    }
  }
}