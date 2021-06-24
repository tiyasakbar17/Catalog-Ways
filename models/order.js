"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Order extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Order.belongsTo(models.User, { as: "user", foreignKey: "userId" });
			Order.hasMany(models.OrderItem, { as: "item", foreignKey: "orderId" });
		}
	}
	Order.init(
		{
			userId: DataTypes.INTEGER,
			status: DataTypes.STRING,
			totalPayment: DataTypes.INTEGER,
			transferEvidence: DataTypes.STRING,
		},
		{
			defaultScope: {
				order: [["createdAt", "ASC"]],
				attributes: {
					exclude: ["updatedAt"],
				},
			},
			sequelize,
			modelName: "Order",
		}
	);
	return Order;
};
