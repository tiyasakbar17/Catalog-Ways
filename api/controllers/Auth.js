const { User} = require("../../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const joi = require("joi");
const { failedResponse, successResponse } = require("../responses");
const sendMail = require("../middlewares/sendEmail");
const { message } = require("../assets/email");

module.exports = {
	registerCustomer: async (req, res) => {
		const { email, password, name } = req.body;
		try {
			const schema = joi.object({
				name: joi.string().min(2).required(),
				email: joi.string().email().required(),
				password: joi.string().min(6).required(),
			});

			const { error } = schema.validate({ ...req.body }, { abortEarly: false });

			if (error) {
				const details = error.details.map((detail) => detail.message.split('"').join("").split("\\").join(""));
				return failedResponse(res, error.details[0].message.split('"').join("").split("\\").join(""), details);
			} else {
				const checkEmail = await User.findOne({
					where: {
						email,
					},
				});

				if (checkEmail !== null) {
					return failedResponse(res, "Use Another Email");
				}

				//** --------------- send email --------------------- */
				const { error } = await sendMail({ to: email, subject: "[Catalog-Ways] Registered Successfully", message: message({ name }) });

				if (error) {
					return failedResponse(res, "terjadi kesalahan saat mengirimkan email");
				}

				//**-----------------inserting data------------------ */
				const hashedPassword = await bcrypt.hash(password, 10);
				const newUserData = {
					...req.body,
					password: hashedPassword,
					role: "customer",
				};
				const newUser = await User.create(newUserData);

				const calledNewUser = await User.findOne({
					where: { id: newUser.id },
					attributes: {
						exclude: ["createdAt", "updatedAt", "deletedAt", "password"],
					},
				});

				//** ------------ making token -------------- */
				const userId = {
					id: calledNewUser.id,
					email: calledNewUser.email,
					role: calledNewUser.role,
				};
				jwt.sign(
					userId,
					process.env.SECRET_KEY,
					{
						expiresIn: 86400,
					},
					(error, token) => {
						if (error) {
							return failedResponse(res, JSON.stringify(error));
						} else {
							const resultToSend = {
								name: calledNewUser.name,
								role: calledNewUser.role,
								orders: calledNewUser.orders,
								cart: calledNewUser.cart,
								token,
							};
							return successResponse(res, resultToSend, "Registered Successfully");
						}
					}
				);
			}
		} catch (error) {
			console.log("something went wrong at addUserCabang======>>>>>>", error);
			failedResponse(res, "server error", JSON.stringify(error));
		}
	},

	login: async (req, res) => {
		const { email, password } = req.body;
		try {
			const schema = joi.object({
				email: joi.string().email().required(),
				password: joi.string().min(6).required(),
			});

			const { error } = schema.validate({ ...req.body }, { abortEarly: false });

			if (error) {
				const details = error.details.map((detail) => detail.message.split('"').join("").split("\\").join(""));
				return failedResponse(res, error.details[0].message.split('"').join("").split("\\").join(""), details);
			}
			const calledUser = await User.findOne({
				where: {
					email,
				},
			});
			if (calledUser === null) {
				return failedResponse(res, "Check your email");
			}
			const validatingPassword = await bcrypt.compare(password, calledUser.password);

			if (!validatingPassword) {
				return failedResponse(res, "Check your password");
			} else {
				const userId = {
					id: calledUser.id,
					email: calledUser.email,
					role: calledUser.role,
				};
				jwt.sign(
					userId,
					process.env.SECRET_KEY,
					{
						expiresIn: 86400,
					},
					(error, token) => {
						if (error) {
							return failedResponse(res, JSON.stringify(error));
						} else {
							const resultToSend = {
								name: calledUser.name,
								role: calledUser.role,
								orders: calledUser.orders,
								cart: calledUser.cart,
								token,
							};
							return successResponse(res, resultToSend, "Logged In");
						}
					}
				);
			}
		} catch (error) {
			console.log("something went wrong at login======>>>>>>", error);
			failedResponse(res, "server error", JSON.stringify(error));
		}
	},

	loadData: async (req, res) => {
		try {
			const calledUser = await User.findOne({
				where: { id: req.user.id },
				attributes: {
					exclude: ["createdAt", "updatedAt", "password"],
				},
			});
			const resultToSend = {
				name: calledUser.name,
				role: calledUser.role,
				orders: calledUser.orders,
				cart: calledUser.cart,
			};
			successResponse(res, resultToSend, "account data loaded");
		} catch (error) {
			console.log("something went wrong at loadData======>>>>>>", error);
			failedResponse(res, "server error", JSON.stringify(error));
		}
	},
};
