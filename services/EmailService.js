const nodemailer = require("nodemailer");
const{pass,user}  = require("../db/TokenKey");

module.exports = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			service: "Gmail",
            auth: {
            user: user,
            pass: pass,
            },
            tls: {
            rejectUnauthorized: false
            }
		});

		await transporter.sendMail({
			from: "Beauty salon",
			to: email,
			subject: subject,
			text: text,
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};