import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

export class Cart extends Model {}

Cart.init(
  {
    id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
  },
  { sequelize,
    modelName: "Cart"
  }

)










// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Cart extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   Cart.init({
//     firstName: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'Cart',
//   });
//   return Cart;
// };