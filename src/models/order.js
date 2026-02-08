import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";


export class Order extends Model {}

Order.init(
  
  {
    id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4
      },
      userId:{
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Users",
          key: "Id"
        },
       onDelete: "CASCADE"
      },
     totalAmount: {
      type: DataTypes.DECIMAL,
      allowNull: false
          
        },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "baking",
          "on_the_way",
          "delivered"
        ),
        defaultValue:"pending"
      },
      paymentStatus:{
        type: DataTypes.ENUM( 
          "pending",
          "paid"
        ),
        defaultValue: "pending"
      },
      orderAddress: {
        type: DataTypes.STRING,
        allowNull: false
      }
  },
  {
    sequelize,
    modelName: "Orders"
  }
)






















// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Order extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     // }
//   }
//   Order.init({
//     status: DataTypes.ENUM
//   }, {
//     sequelize,
//     modelName: 'Order',
//   });
//   return Order;
// };