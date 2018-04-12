// convert milli seconds since Epoch to date str
module.exports = intToStr

function intToStr (intStr) {

  if (typeof intStr !== 'string') {
    return ''
  }
  let intNumber = parseInt(intStr)
  if (isNaN(intNumber)) {
    return ''
  }
  let date = new Date(intNumber)

  let options = {
    day: 'numeric',
    month: 'short', 
    year: 'numeric'
  }

  return date.toLocaleDateString('en-ZA', options)

}