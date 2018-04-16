
const Email = require('email-templates');
const path = require('path')
const emailSecret = require('../config/email.secret.js')

module.exports = sendEmail

const email = new Email({
  message: {
    from: 'xu.shenxin@gmail.com' // replace with support email in production

  },
  send: true,  // if send email for real
  preview: false, // if open rendered email in browser
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
  return email.send({
    template: templateName,
    message: {
      to: toEmail
    },
    locals: data
  })
}