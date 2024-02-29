const nodemailer = require("nodemailer");
const{pass,user}  = require("../db/TokenKey");

module.exports = async (email, subject, text) => {

	const emailContent = `
		<p>Bonjour,</p>
		<p>Bienvenue sur Rasm, votre Salon de beauté professionnel.</p>
		<p>Cliquez sur le bouton ci-dessous pour confirmer votre inscription :</p>
		<a href="${text}" target="_blank" style="display: inline-block; padding: 10px; background-color: #FFB0B0;; color: white; text-decoration: none; border-radius: 5px;">Confirmer</a>
		<p>Merci, </p>
		<p>© m1p11mean-Vanya-Liantsoa</p>
		`;

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
			html: emailContent,
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};