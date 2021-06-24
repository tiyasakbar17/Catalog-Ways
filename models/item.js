"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Item extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Item.hasMany(models.OrderItem, {as: 'orderedBy', foreignKey: 'itemId'})
			Item.hasMany(models.Cart, { as: 'cartedBy', foreignKey: 'itemId'})
			Item.belongsTo(models.Category, {as: 'category', foreignKey: 'categoryId'})
		}
	}
	Item.init(
		{
			itemName: DataTypes.STRING,
			image: DataTypes.STRING,
			price: DataTypes.INTEGER,
			categoryId: DataTypes.INTEGER,
		},
		{
			defaultScope: {
				order: [["createdAt", "DESC"]],
				include: [
					{
						model: sequelize.models.Category,
						as: "category",
					},
				],
				attributes: {
					exclude: ["updatedAt", "deletedAt"],
				},
			},
			sequelize,
			modelName: "Item",
			paranoid: true,
		}
	);
	return Item;
};
