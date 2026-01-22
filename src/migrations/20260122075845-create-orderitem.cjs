'use strict';

const { DataTypes } = require("sequelize")


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orderitems', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: DataTypes.UUIDV4
      },
      orderId:{
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Orders",
          key: "id"
        },
       onDelete: "CASCADE"
      },
      productId:{
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Products",
          key: "id"
        },
       onDelete: "CASCADE"
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      priceAtPurchase:{
        type: Sequelize.DECIMAL,
        allowNull: false

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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orderitems');
  }
};