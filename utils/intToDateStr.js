// convert milli seconds since Epoch to date str
module.exports = intToStr

function intToStr (number) {

  if (typeof number !== 'number') {
    return ''
  }

  let date = new Date(number)

  let options = {
    day: 'numeric',
    month: 'short', 
    year: 'numeric'
  }

  return date.toLocaleDateString('en-ZA', options)

}