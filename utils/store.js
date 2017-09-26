module.exports = {
  // will attach data to this store object
  getUserId: function () {
    let userId = this.user && this.user._id
    return userId
  }
}