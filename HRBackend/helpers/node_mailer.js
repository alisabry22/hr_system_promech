const nodemailer = require("nodemailer");
// const mailOptions  = {
//     from: 'smoothbaron@gmail.com',
//     to: 'asabry@penta3d.com',
//     subject: 'SMTP Test',
//     text: 'it worked.',

//   };
const node_transporter = nodemailer.createTransport({
  service: "gmail", // secure SMTP
  secure: false,
  auth: {
    user: "hr.pro352@gmail.com",
    pass: "owkw gjej vpdr epfw",
  },
  // secure SMTP

  // false for TLS - as a boolean not string - but the default is false so just remove this completely

  //working smtp configuration
  // host: "smtp.office365.com", // Office 365 server
  // port: 587,
  // secureConnection: false,
  // auth: {
  //   user: "promech@promech-eg.com",
  //   pass: "qfgqspjtgqhclxwy",
  // },
  // tls: {
  //   ciphers: "SSLv3",
  //   rejectUnauthorized: false,
  // },
  // requireTLS: true,
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

        resolve(false);
      }else{
        resolve(true);
      }
    })
  })
}

module.exports = { node_transporter,SendEmailToEmployee };
