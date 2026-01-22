import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize.js";

export class Orderitem extends Model {}

Orderitem.init(
  {
    id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4
      },
      orderId:{
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Orders",
          key: "id"
        },
       onDelete: "CASCADE"
      },
      productId:{
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Products",
          key: "id"
        },
       onDelete: "CASCADE"
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      priceAtPurchase:{
        type: DataTypes.DECIMAL,
        allowNull: false

      }
  },
  {
    sequelize,
    modelName: "OrderItems"
  }
)















// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Orderitem extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   Orderitem.init({
//     quantity: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'Orderitem',
//   });
//   return Orderitem;
// };