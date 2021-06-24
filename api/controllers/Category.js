const { Category, sequelize } = require("../../models");
const joi = require("joi");
const { failedResponse, successResponse } = require("../responses");
const { Op } = require("sequelize");

module.exports = {
	addCategory: async (req, res) => {
		try {
			const { categoryName } = req.body;
			const available = await Category.findOne({
				where: {
					categoryName: categoryName.toLowerCase(),
				},
			});
			if (available !== null) {
				return failedResponse(res, "Category had beed registered");
			}
			const schema = joi.object({
				categoryName: joi.string().required(),
			});

			const { error } = schema.validate({ categoryName }, { abortEarly: false });

			if (error) {
				const details = error.details.map((detail) => detail.message.split('"').join("").split("\\").join(""));
				return failedResponse(res, error.details[0].message.split('"').join("").split("\\").join(""), details);
			}
			const newCategory = await Category.create({ categoryName: categoryName.toLowerCase(), status: true });
			if (!newCategory) {
				return failedResponse(res, "Failed to add Category, please try again");
			}
			return successResponse(res, newCategory, "New Category created");
		} catch (error) {
			console.log("Something went wrong at addCategory =====>>>>>", error);
			failedResponse(res, "server error", JSON.stringify(error));
		}
	},

	getAllCategory: async (req, res) => {
		try {
			const { page, keyword, restore } = req.query;
			const conditions = page
				? {
						where: restore
							? keyword
								? {
										categoryName: sequelize.where(sequelize.fn("LOWER", sequelize.col("categoryName")), "LIKE", "%" + keyword.toLowerCase() + "%"),
										deletedAt: { [Op.ne]: null },
								  }
								: { deletedAt: { [Op.ne]: null } }
							: keyword
							? {
									categoryName: sequelize.where(sequelize.fn("LOWER", sequelize.col("categoryName")), "LIKE", "%" + keyword.toLowerCase() + "%"),
							  }
							: {},
						paranoid: restore ? false : true,
						limit: 10,
						offset: (parseInt(page || 1) - 1) * 10,
				  }
				: {
						where: keyword
							? {
									categoryName: sequelize.where(sequelize.fn("LOWER", sequelize.col("categoryName")), "LIKE", "%" + keyword.toLowerCase() + "%"),
							  }
							: {},
				  };
			const allCategory = await Category.findAndCountAll(conditions);

			if (page) {
				const resultToSend = {
					totalPage: Math.ceil(allCategory.count / 10),
					pageNow: parseInt(page || 1),
					data: allCategory.rows,
				};
				return successResponse(res, resultToSend, "Category loaded");
			}
			return successResponse(res, allCategory.rows, "List Category");
		} catch (error) {
			console.log("Something went wrong at getAllCategory =====>>>>>", error);
			failedResponse(res, "server error", JSON.stringify(error));
		}
	},

	editCategory: async (req, res) => {
		try {
			const { id, ...restData } = req.body; //** restData : categoryName */
			const available = await Category.findOne({
				where: {
					id,
				},
			});
			if (available === null) {
				return failedResponse(res, `Category with id ${id} is not found`);
			}
			const schema = joi.object({
				categoryName: joi.string().required(),
			});

			const { error } = schema.validate(restData, { abortEarly: false });

			if (error) {
				const details = error.details.map((detail) => detail.message.split('"').join("").split("\\").join(""));
				return failedResponse(res, error.details[0].message.split('"').join("").split("\\").join(""), details);
			}
			await Category.update(restData, {
				where: {
					id,
				},
			});
			const newData = await Category.findOne({ where: { id } });
			successResponse(res, newData, "Category Updated");
		} catch (error) {
			console.log("Something went wrong at editCategory =====>>>>>", error);
			failedResponse(res, "server error", JSON.stringify(error));
		}
	},

	deleteCategory: async (req, res) => {
		try {
			const { id } = req.query;
			const available = await Category.findOne({
				where: {
					id,
				},
			});
			if (available === null) {
				return failedResponse(res, `Category with id ${id} is not found`);
			}
			await Category.destroy({ where: { id } });
			successResponse(res, id, `Category with id ${id} is deleted`);
		} catch (error) {
			console.log("Something went wrong at deleteCategory =====>>>>>", error);
			failedResponse(res, "server error", JSON.stringify(error));
		}
	},

	restoreCategory: async (req, res) => {
		try {
			const { id } = req.query;
			await Category.restore({ where: { id } });
			const available = await Category.findOne({
				where: {
					id,
				},
			});
			if (available === null) {
				return failedResponse(res, `Category with id ${id} is not found`);
			}
			successResponse(res, available, `Category with id ${id} is restored`);
		} catch (error) {
			console.log("Something went wrong at restoreCategory =====>>>>>", error);
			failedResponse(res, "server error", JSON.stringify(error));
		}
	},
};
