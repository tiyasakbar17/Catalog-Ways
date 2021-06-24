const { Item, sequelize } = require("../../models");
const joi = require("joi");
const { failedResponse, successResponse } = require("../responses");
const { Op } = require("sequelize");

module.exports = {
	addItem: async (req, res) => {
		try {
			const { itemName } = req.body;
			const { image } = req.files;
			const available = await Item.findOne({
				where: {
					itemName,
				},
			});
			if (available !== null) {
				return failedResponse(res, "Item had beed registered");
			}
			const schema = joi.object({
					itemName: joi.string().required(),
					price: joi.number().required(),
					image: joi.string().required(),
					categoryId: joi.number().required(),
				}),
				{ error } = schema.validate({ ...req.body, image: image && image[0].filename }, { abortEarly: false });

			if (error) {
				const details = error.details.map((detail) => detail.message.split('"').join("").split("\\").join(""));
				return failedResponse(res, error.details[0].message.split('"').join("").split("\\").join(""), details);
			}

			const newItem = await Item.create({
				...req.body,
				image: image && image[0].filename,
			});
			if (!newItem) {
				return failedResponse(res, "Failed to add cabang, please try again");
			}
			const calledNewItem = await Item.findOne({
				where: { id: newItem.id },
			});
			return successResponse(res, calledNewItem, "New Item created", 201);
		} catch (error) {
			console.log("Something went wrong at addItem =====>>>>>", error);
			failedResponse(res, "server error", JSON.stringify(error));
		}
	},

	getItems: async (req, res) => {
		try {
			const { page, keyword, restore, category } = req.query;

			const conditions = category ? { categoryId: parseInt(category) } : {};

			const allItem = await Item.findAndCountAll({
				where: restore
					? keyword
						? {
								itemName: sequelize.where(sequelize.fn("LOWER", sequelize.col("itemName")), "LIKE", "%" + keyword.toLowerCase() + "%"),
								deletedAt: { [Op.ne]: null },
						  }
						: { deletedAt: { [Op.ne]: null } }
					: keyword
					? {
							itemName: sequelize.where(sequelize.fn("LOWER", sequelize.col("itemName")), "LIKE", "%" + keyword.toLowerCase() + "%"),
							...conditions,
					  }
					: conditions,
				paranoid: restore ? false : true,
				limit: 10,
				offset: (parseInt(page || 1) - 1) * 10,
			});
			const resultToSend = {
				totalPage: Math.ceil(allItem.count / 10),
				pageNow: parseInt(page || 1),
				data: allItem.rows,
			};
			return successResponse(res, resultToSend, "Item loaded");
		} catch (error) {
			console.log("Something went wrong at getKaryaran =====>>>>>", error);
			failedResponse(res, "server error", JSON.stringify(error));
		}
	},

	updateItem: async (req, res) => {
		try {
			const { id, image: localGambar, ...dataValidate } = req.body;
			const { image } = req.files;
			const newData = image ? { ...dataValidate, image: image[0].filename } : dataValidate;

			const calledItem = await Item.findOne({
				where: {
					id,
				},
			});
			if (calledItem === null) {
				return failedResponse(res, "Item is not registered");
			}

			const schema = joi.object({
					itemName: joi.string(),
					price: joi.number(),
					image: joi.string(),
					categoryId: joi.number(),
				}),
				{ error } = schema.validate(newData, { abortEarly: false });

			if (error) {
				const details = error.details.map((detail) => detail.message.split('"').join("").split("\\").join(""));
				return failedResponse(res, error.details[0].message.split('"').join("").split("\\").join(""), details);
			}

			await Item.update(newData, { where: { id } });

			const calledNewItem = await Item.findOne({
				where: { id },
			});
			successResponse(res, calledNewItem, "Item Updated");
		} catch (error) {
			console.log("Something went wrong at updateItem =====>>>>>", error);
			failedResponse(res, "server error", JSON.stringify(error));
		}
	},

	deleteItem: async (req, res) => {
		try {
			const { id } = req.query;
			const available = await Item.findOne({
				where: {
					id,
				},
			});
			if (available === null) {
				return failedResponse(res, `Item with id ${id} is not found`);
			}
			await Item.destroy({ where: { id } });
			successResponse(res, id, `Item with id ${id} is deleted`);
		} catch (error) {
			console.log("Something went wrong at deleteItem =====>>>>>", error);
			failedResponse(res, "server error", JSON.stringify(error));
		}
	},

	restoreItem: async (req, res) => {
		try {
			const { id } = req.query;
			await Item.restore({ where: { id } });
			const available = await Item.findOne({
				where: {
					id,
				},
			});
			if (available === null) {
				return failedResponse(res, `Item with id ${id} is not found`);
			}
			successResponse(res, available, `Item with id ${id} is restored`);
		} catch (error) {
			console.log("Something went wrong at restoreItem =====>>>>>", error);
			failedResponse(res, "server error", JSON.stringify(error));
		}
	},
};
