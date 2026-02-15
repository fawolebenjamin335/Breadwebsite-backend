import { DataTypes, Model }  from "sequelize";
import { sequelize } from "../config/sequelize.js";


export class Product extends Model {}

Product.init(
  {
    id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4
      },
      Name: {
        type: DataTypes.STRING
      },
      Description: {
        type: DataTypes.STRING
      },
      Price:{
        type: DataTypes.FLOAT,
        allowNull: false

      },
      ImgUrl: {
        type: DataTypes.STRING,
        allowNull: false

      },
      Category: {
        type: DataTypes.STRING,
        allowNull: false
      },
      inStock: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
      }
  },
  {
    sequelize,
    modelName: "Product"
  }
)