import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js"

export class CartItem extends Model {}

CartItem.init(
  {
    id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4
      },
      cartId:{
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Cart',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      productId:{
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Product',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
      },
  },
  {
    sequelize,
    modelName: "CartItem"
  }
)


















// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class CartItem extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   CartItem.init({
//     quantity: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'CartItem',
//   });
//   return CartItem;
// };