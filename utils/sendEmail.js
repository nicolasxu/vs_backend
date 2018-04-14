
const Email = require('email-templates');
const path = require('path')
const emailSecret = require('../config/email.secret.js')

module.exports = sendEmail

const email = new Email({
  message: {
    from: 'xu.shenxin@gmail.com' // replace with support email in production

  },
  send: true,
  transport: emailSecret, 
  views: {
    root: path.resolve('./email_template'), // relative to project root, not current file
    options: {
      extension: 'html',
      map: {
        html: 'htmling'
      }
    }
  }
})

function sendEmail(templateName, data = {}, toEmail) {
  if (!templateName || !toEmail) {
    return
  }
  email.send({
    template: templateName,
    message: {
      to: toEmail
    },
    locals: data
  })
}