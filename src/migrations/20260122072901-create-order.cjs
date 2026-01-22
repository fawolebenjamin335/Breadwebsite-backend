'use strict';

const { DataTypes } = require("sequelize")


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: DataTypes.UUIDV4
      },
      userId:{
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        },
       onDelete: "CASCADE"
      },
     totalAmount: {
      type: Sequelize.DECIMAL,
      allowNull: false
          
        },
      status: {
        type: Sequelize.ENUM(
          "pending",
          "baking",
          "on_the_way",
          "delivered"
        ),
        defaultValue:"pending"
      },
      paymentStatus:{
        type: Sequelize.ENUM( 
          "pending",
          "paid"
        ),
        defaultValue: "pending"
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
    await queryInterface.dropTable('Orders');
  }
};