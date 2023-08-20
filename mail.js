var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: 587,
  requireTLS: true,
  auth: {
    user: "doctrexservices@gmail.com",
    pass: "wssuvhivwtyufhlh",
  },
});

var mailOptions = {
  from: "doctrexservices@gmail.com",
  to: "mudasir.alam2002@gmail.com",
  subject: "Payment Report",
  text: `
Hey Mudasir!
Thanks for using our service.It is a confirmation report that you made payment of 1200 $ to Dr.Jeniffer on 1/12/2023 at 4:08 AM for your regular checkup.

Regards,
DoctrEx.`,
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("email has been send", info.response);
  }
});
