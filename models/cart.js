"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Cart extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Cart.belongsTo(models.User, { as: "cartedBy", foreignKey: "userId" });
			Cart.belongsTo(models.Item, { as: "item", foreignKey: "itemId" });
		}
	}
	Cart.init(
		{
			userId: DataTypes.INTEGER,
			itemId: DataTypes.INTEGER,
		},
		{
			defaultScope: {
				order: [["createdAt", "DESC"]],
				attributes: {
					exclude: ["updatedAt", "deletedAt", "userId", "itemId"],
				},
			},
			sequelize,
			modelName: "Cart",

			paranoid: true,
		}
	);
	return Cart;
};
