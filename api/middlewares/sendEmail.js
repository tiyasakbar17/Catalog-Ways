const nodemailer = require("nodemailer");

const sendMail = async ({ to, subject, message }) => {
	try {
		let transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			secure: false, // true for 456, false for other ports
			requireTLS: true,
			auth: {
				user: 'tiyas.isme@gmail.com', // generated ethereal user
				pass: process.env.PASSWORD, // generated ethereal password
			},
			tls: {
				rejectUnauthorized: false,
			},
		});

		// send mail with defined transport object
		const result = await transporter.sendMail({
			from: '"Catalog Ways" <tiyas.isme@gmail.com>', // sender address
			// replyTo: "tiyas.isme@gmail.com",
			to: to, // list of receivers
			subject: subject, // Subject line
			html: message, // html body
		});
		if (result.rejected.length === 0) {
			return { data: result, error: null };
		}
		return { data: null, error: "Failed to Send Email" };
	} catch (error) {
		console.log("Error when send Message", error);
		return { data: null, error: JSON.stringify(error) };
	}
};

module.exports = sendMail;
