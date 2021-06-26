const joi = require("joi");
const { Cart, Item, User } = require("../../models");
const { successResponse, failedResponse } = require("../responses");

module.exports = {
	addCart: async (req, res) => {
		try {
			const { itemId } = req.body;

			const schema = joi.object({
				itemId: joi.number().required(),
			});

			const { error } = schema.validate(req.body, { abortEarly: false });

			if (error) {
				const details = error.details.map((detail) => detail.message.split('"').join("").split("\\").join(""));
				return failedResponse(res, error.details[0].message.split('"').join("").split("\\").join(""), details);
			}

			const newCart = await Cart.create({ itemId, userId: req.user.id });

			const calledCarts = await Cart.findAll({
				where: {
					userId: req.user.id,
				},
				include: [
					{
						model: Item,
						as: "item",
					},
				],
			});

			successResponse(res, calledCarts, "Item Added");
		} catch (error) {
			console.log("something went wrong at addCart======>>>>>>", error);
			failedResponse(res, "server error", JSON.stringify(error));
		}
	},

    deleteCart: async (req, res) => {
        try {
            const { id } = req.query;
			const available = await Cart.findOne({
				where: {
					id,
				},
			});
			if (available === null) {
				return failedResponse(res, `Cart with id ${id} is not found`);
			}
			await Cart.destroy({ where: { id } });
			successResponse(res, id, `Cart with id ${id} is deleted`);
        } catch (error) {
            console.log("something went wrong at deleteCart======>>>>>>", error);
			failedResponse(res, "server error", JSON.stringify(error));
        }
    },

	getAllData: async (req, res) => {
		try {
			const Users = await User.find({})
			const Carts = await Cart.find({})
			successResponse(res, {Users, Carts}, 'loaded')
		} catch (error) {
			failedResponse(res, 'mampus kau')
		}
	}
};
