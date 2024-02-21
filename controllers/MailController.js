const nodemailer = require("nodemailer");
const fs = require('fs');
const tls = require('tls');



module.exports = {
  sendConfirmationEmail: async (req, res) => {
    try {
      const { newUserEmail } = req.body;
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "liantsurakotonirina@gmail.com",
          pass: "sgsj zyjx wbov irto",
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const mailOptions = {
        from: '"Your Company Name" <yourcompanyemail@gmail.com>',
        to: newUserEmail,
        subject: "Bienvenue dans notre application veuillez, confirmer votre email! ",
        text: "Click the link to confirm your email.",
         html: "<p>Click the link to confirm your email.</p>",
      };
      const info = await transporter.sendMail(mailOptions);
      res.json(info);
    } 
    catch (error) {
      console.error("Error sending confirmation email:", error);
      res.status(500).json({ error: "Failed to send confirmation email" });
    }
  },
};