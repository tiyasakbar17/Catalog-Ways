"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			User.hasMany(models.Order, { as: "orders", foreignKey: "userId" });
			User.hasMany(models.Cart, { as: "cart", foreignKey: 'userId' });
		}
	}
	User.init(
		{
			name: DataTypes.STRING,
			email: DataTypes.STRING,
			password: DataTypes.STRING,
			role: DataTypes.STRING,
		},
		{
			defaultScope: {
				order: [["createdAt", "DESC"]],
				include: [
					{
						model: sequelize.models.Cart,
						as: "cart",
						include: [{
							model: sequelize.models.Item,
							as: 'item',
						}]
					},
				],
				attributes: {
					exclude: ["updatedAt", "deletedAt"],
				},
			},
			sequelize,
			modelName: "User",

			paranoid: true,
		}
	);
	return User;
};
