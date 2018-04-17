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

  pdf.create(invoiceStr, options).toBuffer((err, buffer) => {
    if (err) {
      console.log('error:', err)
      res.status(200).josn({
        err_code: 4002,
        err_msg: 'Generating pdf buffer error'
      })
    } else {
      let fileName = 'Inv-' + invoice.number + ' ' + invoice.toCompany.name + '.pdf'
      res.contentType('application/pdf')
      res.set('x-filename', 'abcinvoice.pdf')
      res.set('Content-disposition', 'attachment; filename=' + fileName)
      res.send(buffer)

    }
  } )
}