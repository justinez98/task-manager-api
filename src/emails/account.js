const sgMail = require('@sendgrid/mail')//require the api key to make the email work
//the snedgrid api module @sendgrid/mail
// const sendgridAPIKey = "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"

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name) => {
    console.log('send email')
    sgMail.send({
        to: email,
        from: 'juxez.yong@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app,${name}. Let me know how you get along with the end`,
    //can put html inside as well
    })
}
const sendCancelationEmail = (email,name) => {
    sgMail.send({
        to:email,
        from:'juxez.yong@gmail.com',
        subject:'Sorry to see you go',
        text: `Goodbye, ${name}. I hope to see you back some time soon`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}