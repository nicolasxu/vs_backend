
const Email = require('email-templates');
const path = require('path')

module.exports = sendEmail
function sendEmail() {
  const email = new Email({
    message: {
      from: 'xu.shenxin@gmail.com'

    },
    // send: true,
    transport: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'xu.shenxin@gmail.com',
        pass: '123456xsx'
      }
    },
    views: {
      root: path.resolve('email_template'),
      options: {
        extension: 'html',
        map: {
          html: 'htmling'
        }
      }
    }
  })

  email.send({
    template:'account_created',
    message: {
      to: 'xu.shenxin@gmail.com'
    }, 
    locals: {
      name: 'nick xu'
    }
  })
  .then(console.log)
  .catch(console.error)

}