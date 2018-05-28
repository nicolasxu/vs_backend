
module.exports = validateRoutingNumber

function validateRoutingNumber(routingNumber) {
  if (!routingNumber) {
    return false
  }

  // 9 digits string
  if (typeof routingNumber !== 'string') {
    return false
  }

  if (routingNumber.length !== 9) {
    return false
  }

  return /^\d+$/.test(routingNumber)

}