// render invoice

const _ = require('lodash')
const cheerio = require('cheerio')
module.exports = renderInvoice


function renderInvoice(invoiceRenderData) {
  let inv = invoiceRenderData

  let templateFunc = _.template(inv.template.html)
  let result = templateFunc(inv)
  
  const $ = cheerio.load(result)
  let css = '<style type="text/css">' + inv.template.css + '</style>' 
  $('invoice').append(css)

  return $.html()

}