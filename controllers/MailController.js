const nodemailer = require("nodemailer");
const fs = require('fs');
const tls = require('tls');



module.exports = {
  sendConfirmationEmail: async (req, res) => {
    try {
      const { newUserEmail } = req.body;

      // Create a transporter (e.g., using Gmail)
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

      // Compose the email
      const mailOptions = {
        from: '"Your Company Name" <yourcompanyemail@gmail.com>',
        to: newUserEmail,
        subject: "Welcome to Our App! Confirm Your Email",
        text: "Click the link to confirm your email.",
        // You can also include an HTML version of the email
         html: "<p>Click the link to confirm your email.</p>",
      };

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      res.json(info);
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      res.status(500).json({ error: "Failed to send confirmation email" });
    }
  },
};