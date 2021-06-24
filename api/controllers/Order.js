const { Cart, Item, Order, OrderItem, User } = require("../../models");
const joi = require("joi");
const { failedResponse, successResponse } = require("../responses");

module.exports = {
	newOrder: async (req, res) => {
		try {
			let totalPayment = 0,
				listItem = [];

			const allItem = await Cart.findAll({
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
			if (allItem.length < 1) {
				return failedResponse(res, "No Item in Cart");
			}

			allItem.forEach((item) => {
				totalPayment += item.item.price;
				listItem.push(item.item.id);
				Cart.destroy({ where: { id: item.id } });
			});

			const newData = {
				userId: req.user.id,
				status: "New",
				totalPayment,
				transferEvidence: "",
			};
			const newOrder = await Order.create(newData);
			listItem.forEach(async (item) => {
				await OrderItem.create({ orderId: newOrder.id, itemId: item });
			});
			successResponse(res, newOrder, "Order created, upload payment evidence in the order page");
		} catch (error) {
			console.log("something went wrong at newOrder======>>>>>>", error);
			failedResponse(res, "server error", JSON.stringify(error));
		}
	},

	getOrders: async (req, res) => {
		try {
			const { page } = req.query;

			const conditions = {
				where: {
					userId: req.user.id,
				},
				include: [
					{
						model: OrderItem,
						as: "item",
					},
					{
						model: User,
						as: "user",
					},
				],
				limit: 10,
				offset: (parseInt(page || 1) - 1) * 10,
			};

			const allOrder = await Order.findAndCountAll(conditions);

			const resultToSend = {
				totalPage: Math.ceil(allOrder.count / 10),
				pageNow: parseInt(page || 1),
				data: allOrder.rows,
			};

			return successResponse(res, resultToSend, "Order loaded");
		} catch (error) {
			console.log("something went wrong at getOrders======>>>>>>", error);
			failedResponse(res, "server error", JSON.stringify(error));
		}
	},

	getOrderAdmin: async (req, res) => {
		try {
			const { page } = req.query;

			const conditions = {
				include: [
					{
						model: OrderItem,
						as: "item",
					},
					{
						model: User,
						as: "user",
					},
				],
				limit: 10,
				offset: (parseInt(page || 1) - 1) * 10,
			};

			const allOrder = await Order.findAndCountAll(conditions);

			const resultToSend = {
				totalPage: Math.ceil(allOrder.count / 10),
				pageNow: parseInt(page || 1),
				data: allOrder.rows,
			};

			return successResponse(res, resultToSend, "Order loaded");
		} catch (error) {
			console.log("something went wrong at getOrderAdmin======>>>>>>", error);
			failedResponse(res, "server error", JSON.stringify(error));
		}
	},

	updateOrder: async (req, res) => {
		try {
			const { id, status, image: localGambar } = req.body;
			const { image } = req.files;

			const updateItem = image ? { status, transferEvidence: image[0].filename } : { status };

			const schema = joi.object({
				status: joi.string().valid("New", "Paid", "Done", "Failed"),
			});

			const { error } = schema.validate({ status }, { abortEarly: false });

			if (error) {
				const details = error.details.map((detail) => detail.message.split('"').join("").split("\\").join(""));
				return failedResponse(res, error.details[0].message.split('"').join("").split("\\").join(""), details);
			}

			const calledOrder = await Order.findOne({
				where: {
					id,
				},
			});
			if (calledOrder === null) {
				return failedResponse(res, "No Order Found");
			}
			if (req.user.role == "admin" || req.user.id == calledOrder.userId) {
				await Order.update(updateItem, { where: { id } });
				const newOrder = await Order.findOne({
					where: { id },
					include: [
						{
							model: OrderItem,
							as: "item",
						},
						{
							model: User,
							as: "user",
						},
					],
				});
				return successResponse(res, newOrder, "Order Updated");
			} else {
				return failedResponse(res, "You can't update this order");
			}
		} catch (error) {
			console.log("something went wrong at updateOrder======>>>>>>", error);
			failedResponse(res, "server error", JSON.stringify(error));
		}
	},
};
