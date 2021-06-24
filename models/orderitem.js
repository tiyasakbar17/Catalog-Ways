"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class OrderItem extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			OrderItem.belongsTo(models.Order, { as: "orderedBy", foreignKey: "orderId" });
			OrderItem.belongsTo(models.Item, { as: "item", foreignKey: "itemId" });
		}
	}
	OrderItem.init(
		{
			orderId: DataTypes.INTEGER,
			itemId: DataTypes.INTEGER,
		},
		{
			defaultScope: {
				order: [["createdAt", "DESC"]],
				include: [
					{
						model: sequelize.models.Item,
						as: "item",
					},
				],
				attributes: {
					exclude: ["updatedAt", "orderId", "itemId"],
				},
			},
			sequelize,
			modelName: "OrderItem",
		}
	);
	return OrderItem;
};
