const Invoice = require('../../models/').Invoice
const pdf = require('html-pdf')

module.exports = invoicePdf


async function invoicePdf(req, res, next) {
  
  // 1. viewId
  let viewId = req.params.viewid
  if (!viewId) {
    return res.status(200).json({
      err_code: 4000,
      err_msg: 'no viewId'
    })
  }

  // 2. find invoice by id
  let invoice = await Invoice.findOne({viewId: viewId})
  if (!invoice) {
    return res.status(200).json({
      err_code: 4001,
      err_msg: 'Can not find invoice'
    })
  }
  
  let options = {
    // format: 'Letter',
    // "zoomFactor": "3",
    width: '8.5in',
    height: '11in'
  }


  let part1 = `
      <style>
         invoice {
          zoom: 0.73; /*workaround for phantomJS2 rendering pages too large*/
        }
      </style>
  `
  let part2 = `

  

  `

  let invoiceStr = part1 + invoice.renderedInvoice + part2

  pdf.create(invoiceStr, options).toFile('./test.pdf', (err, pdfResult) => {
    if (err) {
      console.log('error:', err)
      res.josn('error')
    } else {
      console.log('pdfResult', pdfResult)
      res.json('done')
    }
  } )
}