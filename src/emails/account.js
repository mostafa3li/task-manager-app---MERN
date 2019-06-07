const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "Mostapha.a.aly@gmail.com",
    subject: "Thanks for joining in",
    text: `Welcome to my Task manager app, ${name}.
    I hope you like it.
    
    regards 
    Mostafa Ali
    linkedin.com/in/mostafa3li/ 
    `
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "Mostapha.a.aly@gmail.com",
    subject: "Sorry to see you go",
    text: `Goodbye, ${name}.`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
};
