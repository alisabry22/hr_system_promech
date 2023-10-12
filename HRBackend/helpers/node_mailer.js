const nodemailer = require("nodemailer");
// const mailOptions  = {
//     from: 'smoothbaron@gmail.com',
//     to: 'asabry@penta3d.com',
//     subject: 'SMTP Test',
//     text: 'it worked.',

//   };
const node_transporter = nodemailer.createTransport({
  service: "gmail", // secure SMTP
  // false for TLS - as a boolean not string - but the default is false so just remove this completely
  auth: {
    user: "smoothbaron@gmail.com",
    pass: "dspq tdpm irdg xhnv",
  },
});

// transporter.sendMail(mailOptions ,function(error,info){
//   if(err){
//     console.log(err);
//   }else{
//     console.log('Email sent: ' + info.response);
//   }
// });
module.exports = { node_transporter };
