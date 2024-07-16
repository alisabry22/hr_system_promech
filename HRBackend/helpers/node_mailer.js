const nodemailer = require("nodemailer");

const node_transporter = nodemailer.createTransport({
  // service: "gmail", // secure SMTP
  // secure: false,
  // auth: {
  //   user: "hr.pro352@gmail.com",
  //   pass: "owkw gjej vpdr epfw",
  // },
  // secure SMTP

  // false for TLS - as a boolean not string - but the default is false so just remove this completely

  //working smtp configuration
  host: "smtp.office365.com", // Office 365 server
  port: 587,
  secure:false,
  //secureConnection: false,
  auth: {
    user: "hr.attendance@promech-eg.com",
    pass: "Hr@pro0100$$",
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
    console.log("connection to email package is successfully",success);
  }
});

function SendEmailToEmployee(mail_options){
  return new Promise(async function (resolve,reject){
    node_transporter.sendMail(mail_options,(err,info)=>{
      if(err){
        console.log("error in mail is ",err.message);
        resolve(false);
      }else{
        resolve(true);
      }
    })
  })
}

module.exports = { node_transporter,SendEmailToEmployee };
