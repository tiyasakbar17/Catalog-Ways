"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Category extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Category.hasMany(models.Item, { as: "Items", foreignKey: "categoryId" });
		}
	}
	Category.init(
		{
			categoryName: DataTypes.STRING,
		},
		{
			defaultScope: {
				order: [["createdAt", "DESC"]],
				attributes: {
					exclude: ["updatedAt", "deletedAt"],
				},
			},
			sequelize,
			modelName: "Category",
			paranoid: true,
		}
	);
	return Category;
};
