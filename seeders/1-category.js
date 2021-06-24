"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("Categories", [
			{
				categoryName: 'Motor Sport',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				categoryName: 'Matic',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				categoryName: 'Bebek',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				categoryName: 'Sparepart & Aksesoris',
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
