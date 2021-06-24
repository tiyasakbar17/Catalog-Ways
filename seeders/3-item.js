"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("Items", [
			{
				itemName: "Harley Davidson GT1998",
				image: 'https://www.kabarbisnis.com/images/picture/201901/629-harley.jpg',
				price: 100000000,
				categoryId: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	},
};
