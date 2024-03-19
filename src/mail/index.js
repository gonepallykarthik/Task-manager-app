const nodemailer = require("nodemailer");
require("dotenv").config();

const user_name = process.env.MAIL_USERNAME;
const user_pass = process.env.MAIL_PASS;
const my_mail = process.env.MY_MAIL;

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: user_name,
    pass: user_pass,
  },
});

async function notify(email, username) {
  const info = await transporter.sendMail({
    from: my_mail,
    to: email,
    subject: "Welcome Message 🚀🚀🚀",
    text: `Hello ${username} 👋`,
    html: `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome</title>
          </head>
          <body>
            <h1>Welcome to Our Community!</h1>
            <p>Dear ${username},</p>
            <p>Welcome to our community! We're excited to have you on board.</p>
            <p>Best regards,<br>The Task-App Team</p>
          </body>
          </html>`,
  });

  // console.log(info.messageId);
  // console.log(nodemailer.getTestMessageUrl(info));
}

async function cancellation(email, username) {
  const info = await transporter.sendMail({
    from: my_mail,
    to: email,
    subject: "Cancellation Message 🚀🚀🚀",
    text: `I Hope we meet again ${username} 🥹`,
  });

  // console.log(info.messageId);
  // console.log(nodemailer.getTestMessageUrl(info));
}

module.exports = {
  notify,
  cancellation,
};
