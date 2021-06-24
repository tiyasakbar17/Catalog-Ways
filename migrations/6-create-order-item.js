'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OrderItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderId: {
        type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Orders",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
      },
      itemId: {
        type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Items",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('OrderItems');
  }
};