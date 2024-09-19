const nodemailer = require("nodemailer");

const node_transporter = nodemailer.createTransport({
  host: "smtp.office365.com", // Office 365 server
  port: 587,
  secure: false,
  //secureConnection: false,
  auth: {
    user: "hrattendance@promech-eg.com",
    pass: "HR@@pro010$$",
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
  requireTLS: true,
});
node_transporter.verify((err, success) => {
  if (err) {
    console.log("connection error to send email package", err);
  } else {
    console.log("connection to email package is successfully", success);
  }
});

function SendEmailToEmployee(mail_options) {
  return new Promise(async function (resolve, reject) {
    node_transporter.sendMail(mail_options, (err, info) => {
      if (err) {
        console.log("error in mail is ", err.message);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

module.exports = { node_transporter, SendEmailToEmployee };
